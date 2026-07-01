import Bill from '../models/Bill.js';
import Product from '../models/Product.js';

// @desc    Generate AI Stock Prediction for a random product from top 10 sellers
// @route   GET /api/predictions/stock
// @access  Private
export const generateStockPrediction = async (req, res, next) => {
    try {
        // Get all products for this user
        const products = await Product.find({ user: req.user.id });

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found. Please add products to your inventory first.'
            });
        }

        // Get bills data for the last 60 days to calculate top sellers
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const allBills = await Bill.find({
            user: req.user.id,
            createdAt: { $gte: sixtyDaysAgo }
        });

        // Calculate sales for each product
        const productSales = {};
        allBills.forEach(bill => {
            bill.items.forEach(item => {
                const key = item.name;
                if (!productSales[key]) {
                    productSales[key] = {
                        name: item.name,
                        totalQty: 0,
                        totalRevenue: 0
                    };
                }
                productSales[key].totalQty += item.qty;
                productSales[key].totalRevenue += item.total;
            });
        });

        // Get top 10 products by revenue
        const topProductNames = Object.values(productSales)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 10)
            .map(p => p.name);

        console.log('📊 Top 10 selling products:', topProductNames);

        // Filter products to only include top 10 sellers
        const top10Products = products.filter(p => topProductNames.includes(p.name));

        if (top10Products.length === 0) {
            // If no top sellers found, use all products as fallback
            console.log('⚠️ No top sellers found in bills, using all products');
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            return await generatePredictionResponse(randomProduct, req, res, next, false);
        }

        // Select a random product from top 10
        const randomProduct = top10Products[Math.floor(Math.random() * top10Products.length)];
        console.log(`🎯 Selected product: ${randomProduct.name} (from top 10 sellers)`);

        return await generatePredictionResponse(randomProduct, req, res, next, true);
    } catch (error) {
        next(error);
    }
};

// Helper function to generate prediction response for a specific product
async function generatePredictionResponse(randomProduct, req, res, next, isTopSeller) {
    try {
        // Get bills data for the last 60 days for better analysis
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const recentBills = await Bill.find({
            user: req.user.id,
            createdAt: { $gte: sixtyDaysAgo }
        });

        // Calculate detailed sales data for this specific product
        let totalSold = 0;
        let salesByDay = {};
        let revenueGenerated = 0;
        let salesByWeek = {};
        let dailySalesArray = [];

        recentBills.forEach(bill => {
            bill.items.forEach(item => {
                if (item.name === randomProduct.name || item.productId?.toString() === randomProduct._id.toString()) {
                    totalSold += item.qty;
                    revenueGenerated += item.total;

                    // Track daily sales
                    const billDate = new Date(bill.createdAt);
                    const dateKey = billDate.toISOString().split('T')[0];
                    salesByDay[dateKey] = (salesByDay[dateKey] || 0) + item.qty;

                    // Track weekly sales
                    const weekNumber = Math.floor((Date.now() - billDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
                    salesByWeek[weekNumber] = (salesByWeek[weekNumber] || 0) + item.qty;
                }
            });
        });

        // Create daily sales array for last 60 days
        for (let i = 59; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            dailySalesArray.push({
                date: dateKey,
                qty: salesByDay[dateKey] || 0
            });
        }

        // Calculate statistics
        const daysWithSales = Object.keys(salesByDay).length;
        const avgDailySales = totalSold / 60; // Average over 60 days
        const maxDailySales = Math.max(...Object.values(salesByDay), 0);
        const minDailySales = daysWithSales > 0 ? Math.min(...Object.values(salesByDay).filter(v => v > 0)) : 0;

        // Calculate trend (increasing/decreasing/stable)
        const recentWeekSales = salesByWeek[0] || 0;
        const previousWeekSales = salesByWeek[1] || 0;
        const trend = recentWeekSales > previousWeekSales ? 'increasing' :
            recentWeekSales < previousWeekSales ? 'decreasing' : 'stable';

        // Calculate sales velocity (how fast product moves)
        const salesVelocity = avgDailySales > 0 ? randomProduct.stock / avgDailySales : 999;

        // Prepare comprehensive data for AI prediction
        const predictionData = {
            productName: randomProduct.name,
            currentStock: randomProduct.stock,
            minStock: randomProduct.minStock,
            price: randomProduct.price,

            // Historical data
            totalSoldLast60Days: totalSold,
            avgDailySales: Math.round(avgDailySales * 10) / 10,
            maxDailySales: maxDailySales,
            minDailySales: minDailySales,
            revenueGenerated: Math.round(revenueGenerated),
            daysWithSales: daysWithSales,

            // Trend analysis
            trend: trend,
            recentWeekSales: recentWeekSales,
            previousWeekSales: previousWeekSales,

            // Sales pattern
            dailySalesPattern: dailySalesArray.slice(-21), // Last 21 days
            weeklyPattern: Object.entries(salesByWeek)
                .sort((a, b) => a[0] - b[0])
                .map(([week, qty]) => ({ week: parseInt(week), qty })),

            // Status
            stockStatus: randomProduct.stock < randomProduct.minStock ? 'Low' : 'Good',
            salesVelocity: Math.round(salesVelocity * 10) / 10,
            isTopSeller: isTopSeller
        };

        console.log(`📊 Sales Analysis for ${randomProduct.name}:`);
        console.log(`   - Total sold (60 days): ${totalSold} units`);
        console.log(`   - Avg daily: ${predictionData.avgDailySales} units/day`);
        console.log(`   - Trend: ${trend}`);
        console.log(`   - Days until stockout: ${salesVelocity.toFixed(1)} days`);

        // Get actual sales from last 7 days for comparison
        const last7DaysActual = dailySalesArray.slice(-7).map((d, i) => ({
            day: `Day ${i + 1}`,
            date: d.date,
            actual: d.qty
        }));

        // Generate AI prediction with historical data
        const prediction = await generateAIPrediction(predictionData, last7DaysActual);

        res.status(200).json({
            success: true,
            data: {
                product: {
                    id: randomProduct._id,
                    name: randomProduct.name,
                    emoji: randomProduct.emoji || '📦',
                    currentStock: randomProduct.stock,
                    minStock: randomProduct.minStock,
                    price: randomProduct.price,
                    isTopSeller: isTopSeller
                },
                analytics: {
                    totalSoldLast60Days: totalSold,
                    avgDailySales: predictionData.avgDailySales,
                    maxDailySales: maxDailySales,
                    minDailySales: minDailySales,
                    revenueGenerated: revenueGenerated,
                    daysWithSales: daysWithSales,
                    trend: trend,
                    salesVelocity: predictionData.salesVelocity
                },
                prediction: prediction,
                historicalData: dailySalesArray.slice(-21), // Last 21 days for chart
                last7DaysActual: last7DaysActual // Actual sales from last 7 days
            }
        });
    } catch (error) {
        throw error;
    }
}

// AI Prediction Generation Function using historical sales data
async function generateAIPrediction(data, last7DaysActual) {
    const topSellerNote = data.isTopSeller ? '⭐ This is a TOP SELLER - High priority item!' : '';

    // Format last 7 days sales pattern
    const last7DaysPattern = data.dailySalesPattern
        .slice(-7)
        .map((d, i) => `Day ${i + 1} (${d.date}): ${d.qty} units`)
        .join('\n  ');

    // Calculate last 7 days total
    const last7DaysTotal = data.dailySalesPattern.slice(-7).reduce((sum, d) => sum + d.qty, 0);
    const last7DaysAvg = (last7DaysTotal / 7).toFixed(1);

    const prompt = `You are an inventory management AI for an Indian Kirana store. Analyze the LAST 7 DAYS of ACTUAL SALES and predict the NEXT 7 DAYS.

📦 PRODUCT DATA:
• Product: ${data.productName} ${topSellerNote}
• Current Stock: ${data.currentStock} units
• Minimum Stock Level: ${data.minStock} units
• Price per Unit: ₹${data.price}

📊 LAST 7 DAYS ACTUAL SALES DATA:
  ${last7DaysPattern}

📈 SALES STATISTICS:
• Total Sold (Last 7 Days): ${last7DaysTotal} units
• Average Daily Sales: ${last7DaysAvg} units/day
• Current Trend: ${data.trend.toUpperCase()}
• Sales Velocity: ${data.salesVelocity} days until stockout

🎯 YOUR TASK:
Based on the LAST 7 DAYS pattern above, predict the NEXT 7 DAYS of sales. The predicted sales should be SIMILAR to actual sales but with realistic variation (±10-20%).
${data.isTopSeller ? '⚠️ CRITICAL: This is a top-selling item - ensure it does NOT run out!' : ''}

📋 OUTPUT FORMAT (JSON):
{
  "daysUntilStockout": 5,
  "recommendedReorder": 30,
  "reorderBy": "Thursday",
  "prediction": [
    {"day": "Day 1", "actual": 3, "predicted": 3, "remaining": 45},
    {"day": "Day 2", "actual": 2, "predicted": 3, "remaining": 42},
    {"day": "Day 3", "actual": 4, "predicted": 3, "remaining": 39},
    {"day": "Day 4", "actual": 3, "predicted": 4, "remaining": 35},
    {"day": "Day 5", "actual": 2, "predicted": 3, "remaining": 32},
    {"day": "Day 6", "actual": 3, "predicted": 2, "remaining": 30},
    {"day": "Day 7", "actual": 3, "predicted": 3, "remaining": 27}
  ],
  "insight": "Based on last 7 days, selling ~3 units/day. Predicted sales closely match actual pattern. Stock will last 9 days.",
  "confidence": "High"
}

✅ REQUIREMENTS:
1. Analyze the LAST 7 DAYS pattern to understand daily consumption
2. Predict NEXT 7 DAYS (exactly 7 days):
   - "actual": Copy from last 7 days actual sales (${last7DaysPattern})
   - "predicted": Similar to actual but with ±10-20% variation (NOT exactly same)
   - "remaining": Stock remaining after predicted sales
3. Make predicted values CLOSE to actual but NOT identical:
   - If actual = 3, predicted could be 2, 3, or 4
   - If actual = 5, predicted could be 4, 5, or 6
   - Add realistic daily variation
4. Consider the TREND (${data.trend}):
   - If "increasing": Predicted slightly higher on average
   - If "decreasing": Predicted slightly lower on average
   - If "stable": Predicted similar with random variation
5. Calculate realistic daysUntilStockout based on predicted pattern
6. Recommend reorder quantity for 1-2 weeks supply
7. Suggest reorder day (Monday/Tuesday/Wednesday/Thursday/Friday)
8. Provide clear insight comparing actual vs predicted
9. Confidence: "High" if 6-7 days have sales, "Medium" if 4-5 days, "Low" if < 4 days
${data.isTopSeller ? '10. Add urgency for top sellers!' : ''}

⚠️ CRITICAL: Return ONLY the JSON object with EXACTLY 7 days, no markdown, no explanations.`;

    try {
        // Try AI providers
        const aiResponse = await callAIProviders(prompt);

        // Parse and validate response
        const cleanResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const prediction = JSON.parse(cleanResponse);

        // Validate structure
        if (!prediction.daysUntilStockout || !prediction.prediction || !Array.isArray(prediction.prediction)) {
            throw new Error('Invalid prediction format');
        }

        // Ensure exactly 7 days and add actual sales if missing
        prediction.prediction = prediction.prediction.slice(0, 7).map((p, i) => ({
            ...p,
            actual: p.actual !== undefined ? p.actual : (last7DaysActual[i]?.actual || 0)
        }));

        return prediction;
    } catch (error) {
        console.error('AI Prediction Error:', error.message);
        // Return fallback prediction with 7 days
        return generateFallbackPrediction(data, last7DaysActual);
    }
}

// Call AI providers with fallback
async function callAIProviders(prompt) {
    // 1. Try Groq (Most reliable)
    try {
        const groqKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
        if (groqKey) {
            console.log('🤖 Trying Groq AI for prediction...');
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.5,
                    max_tokens: 2000
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Groq AI prediction generated');
                return data.choices[0].message.content;
            }
        }
    } catch (e) {
        console.warn('⚠️ Groq failed:', e.message);
    }

    // 2. Try Gemini
    try {
        const geminiKey = process.env.VITE_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
        if (geminiKey) {
            console.log('🤖 Trying Google Gemini for prediction...');
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.5,
                            maxOutputTokens: 2000
                        }
                    })
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Gemini prediction generated');
                return data.candidates[0].content.parts[0].text;
            }
        }
    } catch (e) {
        console.warn('⚠️ Gemini failed:', e.message);
    }

    // 3. Try OpenRouter
    try {
        const openRouterKey = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
        if (openRouterKey) {
            console.log('🤖 Trying OpenRouter for prediction...');
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openRouterKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Retail Store Management'
                },
                body: JSON.stringify({
                    model: 'google/gemini-flash-1.5',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.5
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✅ OpenRouter prediction generated');
                return data.choices[0].message.content;
            } else {
                const errorText = await response.text();
                console.warn('⚠️ OpenRouter failed:', errorText);
            }
        }
    } catch (e) {
        console.warn('⚠️ OpenRouter failed:', e.message);
    }

    // 4. Try Mistral
    try {
        const mistralKey = process.env.VITE_MISTRAL_API_KEY || process.env.MISTRAL_API_KEY;
        if (mistralKey) {
            console.log('🤖 Trying Mistral AI for prediction...');
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${mistralKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'mistral-large-latest',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.5
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Mistral AI prediction generated');
                return data.choices[0].message.content;
            } else {
                const errorText = await response.text();
                console.warn('⚠️ Mistral failed:', errorText);
            }
        }
    } catch (e) {
        console.warn('⚠️ Mistral failed:', e.message);
    }

    // 5. Try DeepSeek (Final fallback)
    try {
        const deepseekKey = process.env.VITE_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;
        if (deepseekKey) {
            console.log('🤖 Trying DeepSeek AI for prediction...');
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${deepseekKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.5
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✅ DeepSeek AI prediction generated');
                return data.choices[0].message.content;
            } else {
                const errorText = await response.text();
                console.warn('⚠️ DeepSeek failed:', errorText);
            }
        }
    } catch (e) {
        console.warn('⚠️ DeepSeek failed:', e.message);
    }

    throw new Error('All AI providers failed');
}

// Fallback prediction when AI fails - uses historical data
function generateFallbackPrediction(data, last7DaysActual) {
    // Calculate last 7 days average
    const last7Days = data.dailySalesPattern.slice(-7);
    const last7DaysTotal = last7Days.reduce((sum, d) => sum + d.qty, 0);
    const last7DaysAvg = last7DaysTotal / 7;

    // Use last 7 days average as baseline
    let dailyConsumption = last7DaysAvg > 0 ? last7DaysAvg : data.avgDailySales;

    // Adjust for trend
    if (data.trend === 'increasing') {
        dailyConsumption = dailyConsumption * 1.15; // 15% increase
    } else if (data.trend === 'decreasing') {
        dailyConsumption = dailyConsumption * 0.85; // 15% decrease
    }

    dailyConsumption = Math.max(dailyConsumption, 0.1); // Minimum 0.1 units/day

    // Generate 7 days of prediction data with both actual and predicted
    const prediction = [];
    let currentStock = data.currentStock;
    let totalPredicted = 0;

    for (let i = 0; i < 7; i++) {
        // Get actual sales from last 7 days
        const actual = last7DaysActual[i]?.actual || 0;

        // Generate predicted value similar to actual but with variation (±10-20%)
        let predicted;
        if (actual === 0) {
            // If no actual sales, use daily consumption with small variation
            predicted = Math.max(0, Math.round(dailyConsumption + (Math.random() - 0.5) * dailyConsumption * 0.3));
        } else {
            // Make predicted similar to actual with ±10-20% variation
            const variationPercent = 0.1 + Math.random() * 0.1; // 10-20% variation
            const variation = (Math.random() > 0.5 ? 1 : -1) * actual * variationPercent;
            predicted = Math.max(0, Math.round(actual + variation));

            // Occasionally make them equal (20% chance)
            if (Math.random() < 0.2) {
                predicted = actual;
            }
        }

        totalPredicted += predicted;
        const remaining = Math.max(0, currentStock - predicted);

        prediction.push({
            day: `Day ${i + 1}`,
            actual: actual,
            predicted: predicted,
            remaining: remaining
        });

        currentStock = remaining;
    }

    const avgPredicted = totalPredicted / 7;
    const daysUntilStockout = avgPredicted > 0 ? Math.floor(data.currentStock / avgPredicted) : 999;

    const recommendedReorder = Math.max(
        Math.ceil(avgPredicted * 14), // 2 weeks supply based on predicted
        data.minStock * 2 // Or 2x min stock
    );

    // Determine reorder day
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const reorderDay = daysUntilStockout <= 3 ? 'Immediately' :
        daysUntilStockout <= 7 ? daysOfWeek[Math.min(daysUntilStockout - 1, 4)] :
            'Next week';

    // Determine confidence based on last 7 days data quality
    const daysWithSalesLast7 = last7Days.filter(d => d.qty > 0).length;
    let confidence = 'Low';
    if (daysWithSalesLast7 >= 6) confidence = 'High';
    else if (daysWithSalesLast7 >= 4) confidence = 'Medium';

    // Generate insight with trend and top seller emphasis
    let insight = '';
    const topSellerPrefix = data.isTopSeller ? '⭐ TOP SELLER: ' : '';
    const trendNote = data.trend !== 'stable' ? ` Sales are ${data.trend}.` : '';
    const avgNote = `Predicted ~${Math.round(avgPredicted * 10) / 10} units/day based on last 7 days pattern.`;
    const accuracyNote = last7DaysTotal > 0 ? ` Actual avg was ${last7DaysAvg.toFixed(1)} units/day.` : '';

    if (daysUntilStockout <= 3) {
        insight = `🚨 ${topSellerPrefix}Critical! ${data.productName} will run out in ${daysUntilStockout} days.${trendNote} ${avgNote}${accuracyNote} Order ${recommendedReorder} units ASAP!`;
    } else if (daysUntilStockout <= 7) {
        insight = `⚠️ ${topSellerPrefix}${data.productName} stock low. Will last ${daysUntilStockout} days.${trendNote} ${avgNote}${accuracyNote} Reorder ${recommendedReorder} units by ${reorderDay}.`;
    } else {
        insight = `✅ ${data.productName} stock sufficient for ${daysUntilStockout} days.${trendNote} ${avgNote}${accuracyNote} Plan to reorder ${recommendedReorder} units by ${reorderDay}.`;
    }

    return {
        daysUntilStockout: daysUntilStockout,
        recommendedReorder: recommendedReorder,
        reorderBy: reorderDay,
        prediction: prediction,
        insight: insight,
        confidence: confidence
    };
}
