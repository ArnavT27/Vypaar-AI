import Product from '../models/Product.js';

// @desc    Generate AI Market Trends based on catalog
// @route   GET /api/trending/generate
// @access  Private
export const generateTrending = async (req, res, next) => {
    try {
        // Get all products from user's catalog
        const products = await Product.find({ user: req.user.id });

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found in catalog'
            });
        }

        // Analyze catalog by categories
        const categoryAnalysis = {};
        products.forEach(product => {
            if (!categoryAnalysis[product.category]) {
                categoryAnalysis[product.category] = {
                    count: 0,
                    products: [],
                    avgPrice: 0,
                    totalValue: 0
                };
            }
            categoryAnalysis[product.category].count++;
            categoryAnalysis[product.category].products.push(product.name);
            categoryAnalysis[product.category].totalValue += product.price * product.stock;
        });

        // Calculate average prices
        Object.keys(categoryAnalysis).forEach(category => {
            const cat = categoryAnalysis[category];
            cat.avgPrice = Math.round(cat.totalValue / cat.count);
        });

        // Get top categories by product count
        const topCategories = Object.entries(categoryAnalysis)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 8)
            .map(([category, data]) => ({
                category,
                count: data.count,
                products: data.products.slice(0, 5), // Top 5 products
                avgPrice: data.avgPrice
            }));

        // Prepare data for AI
        const catalogData = {
            totalProducts: products.length,
            categories: topCategories,
            allCategories: Object.keys(categoryAnalysis)
        };

        console.log('📊 Catalog Analysis:', {
            totalProducts: catalogData.totalProducts,
            topCategories: topCategories.map(c => `${c.category} (${c.count})`).join(', ')
        });

        // Generate AI trending predictions
        const trending = await generateAITrending(catalogData);

        res.status(200).json({
            success: true,
            data: trending
        });
    } catch (error) {
        next(error);
    }
};

// AI Trending Generation Function
async function generateAITrending(data) {
    // Format categories for AI
    const categoriesText = data.categories
        .map(c => `• ${c.category}: ${c.count} products (${c.products.slice(0, 3).join(', ')})`)
        .join('\n  ');

    const prompt = `You are a market trend analyst for Indian Kirana stores. Analyze this store's product catalog and predict 4 trending product categories based on GENERAL MARKET TRENDS in India (NOT sales data).

📦 STORE CATALOG ANALYSIS:
• Total Products: ${data.totalProducts}
• Categories Available:
  ${categoriesText}

🎯 YOUR TASK:
Based on the categories available in this store's catalog, predict which 4 categories are currently trending in the Indian market. Consider:
- Seasonal trends (current month: ${new Date().toLocaleString('en-IN', { month: 'long' })})
- Festival seasons in India
- Weather patterns (summer/winter/monsoon)
- General consumer behavior in India
- Economic trends
- Social media trends
- Health and wellness trends

📋 OUTPUT FORMAT (JSON Array):
[
  {
    "id": 1,
    "name": "Cold Beverages",
    "change": "+45%",
    "reason": "Summer season driving high demand across India",
    "emoji": "🥤"
  }
]

✅ REQUIREMENTS:
1. Select 4 categories from the store's available categories ONLY
2. Predict realistic trend percentages (+10% to +60%)
3. Provide specific, India-focused reasons (festivals, seasons, trends)
4. Use appropriate emojis for each category
5. Consider current time of year and Indian market conditions
6. Focus on GENERAL MARKET TRENDS, not this specific store's sales
7. Be realistic - not all categories can be +50%
8. Reason should be max 60 characters

🇮🇳 INDIAN MARKET CONTEXT:
- Festival seasons: Diwali, Holi, Raksha Bandhan, Eid, Christmas
- Weather: Summer (Mar-Jun), Monsoon (Jul-Sep), Winter (Oct-Feb)
- Consumer behavior: Value for money, family packs, traditional preferences
- Growing trends: Health products, electronics, personal care

⚠️ CRITICAL: Return ONLY the JSON array, no markdown, no explanations, no extra text.`;

    try {
        // Try AI providers
        const aiResponse = await callAIProviders(prompt);

        // Parse and validate response
        const cleanResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const trending = JSON.parse(cleanResponse);

        // Validate structure
        if (!Array.isArray(trending) || trending.length === 0) {
            throw new Error('Invalid trending format');
        }

        return trending.slice(0, 4); // Return max 4 trends
    } catch (error) {
        console.error('AI Trending Error:', error.message);
        // Return fallback trending based on catalog
        return generateFallbackTrending(data);
    }
}

// Call AI providers with fallback
async function callAIProviders(prompt) {
    // 1. Try Groq (Most reliable and fast)
    try {
        const groqKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
        if (groqKey) {
            console.log('🤖 Trying Groq AI for trending...');
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
                console.log('✅ Groq AI trending generated');
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
            console.log('🤖 Trying Google Gemini for trending...');
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
                console.log('✅ Gemini trending generated');
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
            console.log('🤖 Trying OpenRouter for trending...');
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
                console.log('✅ OpenRouter trending generated');
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
            console.log('🤖 Trying Mistral AI for trending...');
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
                console.log('✅ Mistral AI trending generated');
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
            console.log('🤖 Trying DeepSeek AI for trending...');
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
                console.log('✅ DeepSeek AI trending generated');
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

// Fallback trending when AI fails
function generateFallbackTrending(data) {
    const trending = [];
    const currentMonth = new Date().getMonth(); // 0-11

    // Get category emojis
    const categoryEmojis = {
        'Snacks': '🍪',
        'Beverages': '🥤',
        'Dairy': '🥛',
        'Grocery': '🌾',
        'Personal Care': '🧴',
        'Household': '🧺',
        'Electronics': '🔌',
        'Clothing': '👕',
        'Toys': '🎮',
        'Stationery': '📓',
        'Bakery': '🍞'
    };

    // Season-based trending logic
    let seasonalCategories = [];

    // Summer (Mar-Jun): months 2-5
    if (currentMonth >= 2 && currentMonth <= 5) {
        seasonalCategories = [
            { category: 'Beverages', change: '+45%', reason: 'Summer heat driving cold drink demand' },
            { category: 'Personal Care', change: '+32%', reason: 'Sunscreen and summer care products trending' },
            { category: 'Snacks', change: '+28%', reason: 'Light snacks popular in hot weather' },
            { category: 'Dairy', change: '+22%', reason: 'Lassi and cold dairy products in demand' }
        ];
    }
    // Monsoon (Jul-Sep): months 6-8
    else if (currentMonth >= 6 && currentMonth <= 8) {
        seasonalCategories = [
            { category: 'Snacks', change: '+38%', reason: 'Pakora season - snacks with tea trending' },
            { category: 'Grocery', change: '+35%', reason: 'Stocking up during monsoon season' },
            { category: 'Personal Care', change: '+25%', reason: 'Monsoon skincare and haircare demand' },
            { category: 'Household', change: '+20%', reason: 'Cleaning products for monsoon hygiene' }
        ];
    }
    // Festival season (Oct-Nov): months 9-10
    else if (currentMonth >= 9 && currentMonth <= 10) {
        seasonalCategories = [
            { category: 'Snacks', change: '+55%', reason: 'Diwali festival driving snack purchases' },
            { category: 'Grocery', change: '+48%', reason: 'Festival cooking and gifting season' },
            { category: 'Clothing', change: '+42%', reason: 'New clothes for Diwali celebrations' },
            { category: 'Electronics', change: '+38%', reason: 'Diwali shopping and gifting trend' }
        ];
    }
    // Winter (Dec-Feb): months 11, 0, 1
    else {
        seasonalCategories = [
            { category: 'Grocery', change: '+35%', reason: 'Winter cooking and warm food ingredients' },
            { category: 'Clothing', change: '+40%', reason: 'Winter wear and warm clothing demand' },
            { category: 'Beverages', change: '+25%', reason: 'Hot beverages like tea and coffee popular' },
            { category: 'Personal Care', change: '+28%', reason: 'Winter skincare and moisturizers trending' }
        ];
    }

    // Filter to only include categories that exist in the store
    const availableCategories = data.allCategories;
    seasonalCategories.forEach((trend, index) => {
        if (availableCategories.includes(trend.category) && trending.length < 4) {
            trending.push({
                id: trending.length + 1,
                name: trend.category,
                change: trend.change,
                reason: trend.reason,
                emoji: categoryEmojis[trend.category] || '📦'
            });
        }
    });

    // If we don't have 4 trends yet, add top categories from catalog
    if (trending.length < 4) {
        data.categories.forEach(cat => {
            if (trending.length < 4 && !trending.find(t => t.name === cat.category)) {
                trending.push({
                    id: trending.length + 1,
                    name: cat.category,
                    change: '+18%',
                    reason: 'Consistent demand in Indian market',
                    emoji: categoryEmojis[cat.category] || '📦'
                });
            }
        });
    }

    return trending.slice(0, 4);
}
