import Bill from '../models/Bill.js';
import Product from '../models/Product.js';

// @desc    Generate AI Business Insights
// @route   GET /api/insights/generate
// @access  Private
export const generateInsights = async (req, res, next) => {
    try {
        // Fetch last 7 days data
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Get bills data for last 7 days and previous 7 days
        const [last7DaysBills, previous7DaysBills] = await Promise.all([
            Bill.find({
                user: req.user.id,
                createdAt: { $gte: sevenDaysAgo }
            }),
            Bill.find({
                user: req.user.id,
                createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
            }),
        ]);

        // Get products data
        const products = await Product.find({ user: req.user.id });
        const lowStockProducts = products.filter(p => p.stock < p.minStock);
        const outOfStockProducts = products.filter(p => p.stock === 0);

        // Calculate metrics for last 7 days
        const last7DaysSales = last7DaysBills.reduce((sum, b) => sum + b.total, 0);
        const previous7DaysSales = previous7DaysBills.reduce((sum, b) => sum + b.total, 0);
        const avgBillValue = last7DaysBills.length > 0
            ? last7DaysBills.reduce((sum, b) => sum + b.total, 0) / last7DaysBills.length
            : 0;
        const avgDailySales = last7DaysSales / 7;

        // Calculate daily sales pattern for last 7 days
        const dailySalesPattern = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayBills = last7DaysBills.filter(b => {
                const billDate = new Date(b.createdAt);
                return billDate >= date && billDate < nextDate;
            });

            const daySales = dayBills.reduce((sum, b) => sum + b.total, 0);
            const dayBillCount = dayBills.length;

            dailySalesPattern.push({
                date: date.toISOString().split('T')[0],
                sales: Math.round(daySales),
                bills: dayBillCount
            });
        }

        // Get top selling products from last 7 days
        const productSales = {};
        last7DaysBills.forEach(bill => {
            bill.items.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = { qty: 0, revenue: 0 };
                }
                productSales[item.name].qty += item.qty;
                productSales[item.name].revenue += item.total;
            });
        });

        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 5)
            .map(([name, data]) => ({ name, ...data }));

        // Calculate trend
        const salesTrend = last7DaysSales > previous7DaysSales ? 'increasing' :
            last7DaysSales < previous7DaysSales ? 'decreasing' : 'stable';
        const trendPercentage = previous7DaysSales > 0
            ? Math.round(((last7DaysSales - previous7DaysSales) / previous7DaysSales) * 100)
            : 0;

        // Prepare data for AI with 7-day focus
        const businessData = {
            // Last 7 days metrics
            last7DaysSales: Math.round(last7DaysSales),
            previous7DaysSales: Math.round(previous7DaysSales),
            avgDailySales: Math.round(avgDailySales),
            avgBillValue: Math.round(avgBillValue),
            totalBillsLast7Days: last7DaysBills.length,

            // Daily pattern
            dailySalesPattern: dailySalesPattern,

            // Trend analysis
            salesTrend: salesTrend,
            trendPercentage: trendPercentage,

            // Inventory status
            lowStockCount: lowStockProducts.length,
            outOfStockCount: outOfStockProducts.length,
            lowStockItems: lowStockProducts.map(p => p.name).slice(0, 3),

            // Top performers
            topProducts: topProducts.map(p => ({ name: p.name, revenue: p.revenue, qty: p.qty })).slice(0, 3),
        };

        console.log('📊 Last 7 Days Business Data:', {
            sales: businessData.last7DaysSales,
            bills: businessData.totalBillsLast7Days,
            trend: businessData.salesTrend,
            trendPercentage: businessData.trendPercentage
        });

        // Generate AI insights using the AI pipeline
        const insights = await generateAIInsights(businessData);

        res.status(200).json({
            success: true,
            data: insights,
        });
    } catch (error) {
        next(error);
    }
};

// AI Insight Generation Function
async function generateAIInsights(data) {
    // Format daily sales pattern for AI
    const dailyPattern = data.dailySalesPattern
        .map((d, i) => `Day ${i + 1} (${d.date}): ₹${d.sales} (${d.bills} bills)`)
        .join('\n  ');

    const trendEmoji = data.salesTrend === 'increasing' ? '📈' :
        data.salesTrend === 'decreasing' ? '📉' : '➡️';
    const trendText = data.trendPercentage !== 0
        ? `${data.trendPercentage > 0 ? '+' : ''}${data.trendPercentage}%`
        : 'stable';

    const prompt = `You are an expert business analyst for Indian Kirana stores. Analyze the LAST 7 DAYS of sales data and provide 4 actionable business insights.

📊 LAST 7 DAYS PERFORMANCE DATA:
• Total Sales (Last 7 Days): ₹${data.last7DaysSales.toLocaleString('en-IN')}
• Previous 7 Days Sales: ₹${data.previous7DaysSales.toLocaleString('en-IN')}
• Sales Trend: ${data.salesTrend.toUpperCase()} ${trendEmoji} (${trendText} vs previous week)
• Average Daily Sales: ₹${data.avgDailySales.toLocaleString('en-IN')}/day
• Average Bill Value: ₹${data.avgBillValue}
• Total Bills (Last 7 Days): ${data.totalBillsLast7Days}

📅 DAILY SALES PATTERN (Last 7 Days):
  ${dailyPattern}

📦 INVENTORY STATUS:
• Low Stock Items: ${data.lowStockCount} products ${data.lowStockItems.length > 0 ? `(${data.lowStockItems.join(', ')})` : ''}
• Out of Stock Items: ${data.outOfStockCount} products

🏆 TOP PERFORMERS (Last 7 Days):
${data.topProducts.length > 0 ? data.topProducts.map(p => `• ${p.name}: ₹${p.revenue} revenue (${p.qty} units)`).join('\n') : '• No sales data'}

🎯 YOUR TASK:
Analyze the LAST 7 DAYS pattern and provide 4 specific, actionable insights that will help this Kirana store owner make better business decisions TODAY.

📋 OUTPUT FORMAT (JSON Array):
[
  {
    "id": 1,
    "type": "success",
    "title": "Sales Growing Strong",
    "message": "Last 7 days sales ₹45,000 is 25% higher than previous week's ₹36,000. Daily avg: ₹6,428.",
    "action": "Continue current sales strategies"
  }
]

✅ REQUIREMENTS:
1. Types: Use "success" (positive), "warning" (needs attention), "alert" (urgent), "info" (neutral)
2. Be SPECIFIC: Include actual numbers from the LAST 7 DAYS data
3. Be ACTIONABLE: Each insight must suggest a clear next step
4. Be RELEVANT: Focus on Indian Kirana store context
5. Focus Areas: 
   - 7-day sales trend vs previous 7 days
   - Daily sales patterns (which days were strong/weak)
   - Inventory alerts (urgent restocking needs)
   - Top performers from last 7 days
   - Customer behavior (bills per day, avg bill value)
6. Title: Max 50 characters, clear and direct
7. Message: Max 150 characters, include specific numbers from last 7 days
8. Action: Max 80 characters, tell them what to do
9. Use the daily pattern to identify specific opportunities or concerns

⚠️ CRITICAL: Return ONLY the JSON array, no markdown, no explanations, no extra text.`;

    try {
        // Try multiple AI providers in order
        const aiResponse = await callAIProviders(prompt);

        // Parse and validate response
        const cleanResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const insights = JSON.parse(cleanResponse);

        // Validate structure
        if (!Array.isArray(insights) || insights.length === 0) {
            throw new Error('Invalid insights format');
        }

        return insights.slice(0, 4); // Return max 4 insights
    } catch (error) {
        console.error('AI Insights Error:', error.message);
        // Return fallback insights based on data
        return generateFallbackInsights(data);
    }
}

// Call AI providers with fallback
async function callAIProviders(prompt) {
    // 1. Try Groq (Most reliable and fast)
    try {
        const groqKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
        if (groqKey) {
            console.log('🤖 Trying Groq AI...');
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Groq AI responded successfully');
                return data.choices[0].message.content;
            } else {
                const errorText = await response.text();
                console.warn('⚠️ Groq failed:', errorText);
            }
        }
    } catch (e) {
        console.warn('⚠️ Groq failed:', e.message);
    }

    // 2. Try Gemini
    try {
        const geminiKey = process.env.VITE_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
        if (geminiKey) {
            console.log('🤖 Trying Google Gemini...');
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1000,
                            topP: 0.95,
                            topK: 40
                        }
                    })
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Gemini responded successfully');
                return data.candidates[0].content.parts[0].text;
            } else {
                const errorText = await response.text();
                console.warn('⚠️ Gemini failed:', errorText);
            }
        }
    } catch (e) {
        console.warn('⚠️ Gemini failed:', e.message);
    }

    // 3. Try OpenRouter
    try {
        const openRouterKey = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
        if (openRouterKey) {
            console.log('🤖 Trying OpenRouter...');
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
                    temperature: 0.7
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✅ OpenRouter responded successfully');
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
            console.log('🤖 Trying Mistral AI...');
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${mistralKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'mistral-large-latest',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Mistral AI responded successfully');
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
            console.log('🤖 Trying DeepSeek AI...');
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${deepseekKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✅ DeepSeek AI responded successfully');
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

// Fallback insights when AI fails
function generateFallbackInsights(data) {
    const insights = [];
    const dailyAvg = data.avgDailySales;
    const trendPercentage = data.trendPercentage;

    // 1. Sales trend insight - Compare last 7 days vs previous 7 days
    if (data.last7DaysSales > 0 || data.previous7DaysSales > 0) {
        let type = 'info';
        let message = '';
        let action = '';

        if (data.salesTrend === 'increasing') {
            type = 'success';
            message = `Last 7 days: ₹${data.last7DaysSales.toLocaleString('en-IN')} (${trendPercentage > 0 ? '+' : ''}${trendPercentage}% vs previous week). Daily avg: ₹${dailyAvg.toLocaleString('en-IN')}.`;
            action = 'Great momentum! Keep it up';
        } else if (data.salesTrend === 'decreasing') {
            type = 'warning';
            message = `Last 7 days: ₹${data.last7DaysSales.toLocaleString('en-IN')} (${trendPercentage}% vs previous week). Daily avg: ₹${dailyAvg.toLocaleString('en-IN')}.`;
            action = 'Focus on promotions to boost sales';
        } else {
            type = 'info';
            message = `Last 7 days: ₹${data.last7DaysSales.toLocaleString('en-IN')} (stable vs previous week). Daily avg: ₹${dailyAvg.toLocaleString('en-IN')}.`;
            action = 'Maintain consistency, explore growth opportunities';
        }

        insights.push({
            id: 1,
            type: type,
            title: data.salesTrend === 'increasing' ? '📈 Sales Growing' :
                data.salesTrend === 'decreasing' ? '📉 Sales Declining' : '➡️ Steady Sales',
            message: message,
            action: action
        });
    }

    // 2. Inventory alert - Critical for stock management
    if (data.outOfStockCount > 0) {
        insights.push({
            id: 2,
            type: 'alert',
            title: '🚨 Out of Stock Alert',
            message: `${data.outOfStockCount} products completely out of stock! This is affecting your sales potential.`,
            action: 'Restock immediately from Marketplace'
        });
    } else if (data.lowStockCount > 0) {
        const items = data.lowStockItems.length > 0 ? `: ${data.lowStockItems.slice(0, 2).join(', ')}` : '';
        insights.push({
            id: 2,
            type: 'warning',
            title: '⚠️ Low Stock Warning',
            message: `${data.lowStockCount} products running low${items}. Reorder before they run out.`,
            action: 'Check Inventory and reorder soon'
        });
    } else {
        insights.push({
            id: 2,
            type: 'success',
            title: '✅ Inventory Healthy',
            message: 'All products are well-stocked. No immediate reordering needed.',
            action: 'Monitor daily and maintain stock levels'
        });
    }

    // 3. Customer behavior insight from last 7 days
    if (data.avgBillValue > 0 && data.totalBillsLast7Days > 0) {
        const customerPerDay = Math.round(data.totalBillsLast7Days / 7);
        const billValueStatus = data.avgBillValue >= 500 ? 'excellent' :
            data.avgBillValue >= 300 ? 'good' : 'moderate';

        insights.push({
            id: 3,
            type: billValueStatus === 'excellent' ? 'success' : 'info',
            title: '👥 Customer Insights',
            message: `Last 7 days: ${data.totalBillsLast7Days} bills (~${customerPerDay}/day). Avg bill: ₹${data.avgBillValue}.`,
            action: data.avgBillValue < 300 ? 'Try combo offers to increase bill value' : 'Great customer spending!'
        });
    } else {
        insights.push({
            id: 3,
            type: 'info',
            title: '📊 Start Tracking',
            message: 'No bills recorded in last 7 days. Start billing to get personalized insights.',
            action: 'Use Billing feature for every sale'
        });
    }

    // 4. Top products insight from last 7 days
    if (data.topProducts.length > 0) {
        const topItems = data.topProducts.slice(0, 2).map(p => p.name).join(', ');
        const topRevenue = data.topProducts[0].revenue;
        insights.push({
            id: 4,
            type: 'success',
            title: '🏆 Best Sellers (7 Days)',
            message: `Top performers: ${topItems}. Leading with ₹${topRevenue.toLocaleString('en-IN')} revenue.`,
            action: 'Always keep these items in stock'
        });
    } else {
        // Daily pattern insight
        const bestDay = data.dailySalesPattern.reduce((max, day) =>
            day.sales > max.sales ? day : max, data.dailySalesPattern[0]);

        if (bestDay && bestDay.sales > 0) {
            const dayName = new Date(bestDay.date).toLocaleDateString('en-IN', { weekday: 'long' });
            insights.push({
                id: 4,
                type: 'info',
                title: '📅 Best Day Pattern',
                message: `${dayName} was your best day with ₹${bestDay.sales.toLocaleString('en-IN')} sales.`,
                action: 'Plan promotions around strong days'
            });
        } else {
            insights.push({
                id: 4,
                type: 'info',
                title: '💡 Business Tip',
                message: 'Keep entering bills regularly to get personalized AI insights about your store.',
                action: 'Use the Billing feature for every sale'
            });
        }
    }

    return insights.slice(0, 4);
}
