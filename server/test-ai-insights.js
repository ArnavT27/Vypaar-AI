import dotenv from 'dotenv';
dotenv.config();

// Test AI Insights Generation
async function testAIInsights() {
    console.log('🧪 Testing AI Insights Generation...\n');

    // Sample business data
    const businessData = {
        weekSales: 45000,
        monthSales: 180000,
        avgBillValue: 250,
        totalBills: 720,
        weekBillsCount: 180,
        lowStockCount: 5,
        outOfStockCount: 2,
        topProducts: ['Coca-Cola', 'Lays Chips', 'Maggi Noodles'],
        lowStockItems: ['Coca-Cola', 'Parle-G', 'Tata Salt'],
    };

    console.log('📊 Business Data:');
    console.log(JSON.stringify(businessData, null, 2));
    console.log('\n');

    const prompt = `You are a business analyst for an Indian Kirana store. Analyze this data and provide 4 actionable business insights in JSON format.

Store Data:
- Week Sales: ₹${businessData.weekSales}
- Month Sales: ₹${businessData.monthSales}
- Average Bill Value: ₹${businessData.avgBillValue}
- Total Bills: ${businessData.totalBills}
- Bills This Week: ${businessData.weekBillsCount}
- Low Stock Items: ${businessData.lowStockCount}
- Out of Stock Items: ${businessData.outOfStockCount}
- Top Products: ${businessData.topProducts.join(', ')}
- Low Stock Products: ${businessData.lowStockItems.join(', ')}

Generate 4 insights as a JSON array with this exact structure:
[
  {
    "id": 1,
    "type": "success" | "warning" | "info" | "alert",
    "title": "Short title (max 50 chars)",
    "message": "Detailed insight (max 150 chars)",
    "action": "Recommended action (max 80 chars)"
  }
]

Rules:
1. Use "success" for positive trends, "warning" for concerns, "alert" for urgent issues, "info" for general insights
2. Be specific with numbers from the data
3. Focus on: sales trends, inventory management, customer behavior, revenue optimization
4. Make insights actionable and relevant to Indian Kirana stores
5. Return ONLY the JSON array, no other text`;

    // Try Gemini
    console.log('🤖 Trying Google Gemini...');
    try {
        const geminiKey = process.env.VITE_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
        console.log(`API Key: ${geminiKey ? geminiKey.substring(0, 10) + '...' : 'NOT FOUND'}`);

        if (geminiKey) {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
                    })
                }
            );

            console.log(`Response Status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                const aiText = data.candidates[0].content.parts[0].text;
                console.log('\n✅ Gemini Response:');
                console.log(aiText);

                // Parse and display insights
                const cleanResponse = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
                const insights = JSON.parse(cleanResponse);

                console.log('\n📋 Parsed Insights:');
                insights.forEach((insight, i) => {
                    console.log(`\n${i + 1}. ${insight.title} [${insight.type}]`);
                    console.log(`   Message: ${insight.message}`);
                    console.log(`   Action: ${insight.action}`);
                });

                return insights;
            } else {
                const errorText = await response.text();
                console.log(`❌ Gemini Error: ${errorText}`);
            }
        } else {
            console.log('❌ Gemini API key not found');
        }
    } catch (e) {
        console.error('❌ Gemini failed:', e.message);
    }

    // Try Groq
    console.log('\n🤖 Trying Groq...');
    try {
        const groqKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
        console.log(`API Key: ${groqKey ? groqKey.substring(0, 10) + '...' : 'NOT FOUND'}`);

        if (groqKey) {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });

            console.log(`Response Status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                const aiText = data.choices[0].message.content;
                console.log('\n✅ Groq Response:');
                console.log(aiText);

                // Parse and display insights
                const cleanResponse = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
                const insights = JSON.parse(cleanResponse);

                console.log('\n📋 Parsed Insights:');
                insights.forEach((insight, i) => {
                    console.log(`\n${i + 1}. ${insight.title} [${insight.type}]`);
                    console.log(`   Message: ${insight.message}`);
                    console.log(`   Action: ${insight.action}`);
                });

                return insights;
            } else {
                const errorText = await response.text();
                console.log(`❌ Groq Error: ${errorText}`);
            }
        } else {
            console.log('❌ Groq API key not found');
        }
    } catch (e) {
        console.error('❌ Groq failed:', e.message);
    }

    console.log('\n❌ All AI providers failed. Using fallback insights.');

    // Fallback insights
    const fallbackInsights = [
        {
            id: 1,
            type: 'success',
            title: 'Weekly Sales Performance',
            message: `Your store generated ₹${businessData.weekSales} this week with an average of ₹${Math.round(businessData.weekSales / 7)} per day.`,
            action: 'Maintain current sales momentum'
        },
        {
            id: 2,
            type: 'warning',
            title: 'Low Stock Alert',
            message: `${businessData.lowStockCount} products are running low. Items include: ${businessData.lowStockItems.join(', ')}.`,
            action: 'Reorder stock immediately'
        },
        {
            id: 3,
            type: 'info',
            title: 'Customer Spending Pattern',
            message: `Average bill value is ₹${businessData.avgBillValue}. ${businessData.weekBillsCount} customers visited this week.`,
            action: 'Consider upselling strategies'
        },
        {
            id: 4,
            type: 'success',
            title: 'Best Selling Products',
            message: `Top performers: ${businessData.topProducts.join(', ')}. These drive most revenue.`,
            action: 'Keep these items well-stocked'
        }
    ];

    console.log('\n📋 Fallback Insights:');
    fallbackInsights.forEach((insight, i) => {
        console.log(`\n${i + 1}. ${insight.title} [${insight.type}]`);
        console.log(`   Message: ${insight.message}`);
        console.log(`   Action: ${insight.action}`);
    });

    return fallbackInsights;
}

// Run test
testAIInsights()
    .then(() => {
        console.log('\n✅ Test completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });
