import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Insight from '../models/Insight.js';

dotenv.config();

const connectDB = async () => {
    const DB = process.env.DATABASE.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD
    );
    await mongoose.connect(DB, { dbName: 'retail_store' });
    console.log('✅ MongoDB Connected');
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany();
        await Product.deleteMany();
        await Customer.deleteMany();
        await Insight.deleteMany();

        // Create demo user
        console.log('👤 Creating demo user...');
        const user = await User.create({
            name: 'Demo Store Owner',
            email: 'demo@store.com',
            password: 'demo123',
            phone: '+91 9876543210',
            storeName: 'Quick Mart Retail Store',
            storeAddress: 'Shop No. 5, Main Market, Mumbai',
            role: 'admin',
        });

        console.log('✅ Demo user created:', user.email);
        console.log('🔑 Password: demo123');

        // Create sample products
        console.log('📦 Creating sample products...');
        const products = [
            { name: 'Parle-G Biscuit', category: 'Snacks', price: 10, stock: 48, minStock: 20, unit: 'pkt', emoji: '🍪' },
            { name: 'Amul Milk 500ml', category: 'Dairy', price: 30, stock: 12, minStock: 25, unit: 'pkt', emoji: '🥛' },
            { name: 'Coca-Cola 750ml', category: 'Beverages', price: 40, stock: 6, minStock: 15, unit: 'btl', emoji: '🥤' },
            { name: 'Lays Classic', category: 'Snacks', price: 20, stock: 75, minStock: 30, unit: 'pkt', emoji: '🥔' },
            { name: 'Maggi 70g', category: 'Grocery', price: 14, stock: 0, minStock: 20, unit: 'pkt', emoji: '🍜' },
            { name: 'Surf Excel 1kg', category: 'Household', price: 165, stock: 22, minStock: 10, unit: 'pkt', emoji: '🧺' },
            { name: 'Colgate 100g', category: 'Personal Care', price: 55, stock: 34, minStock: 15, unit: 'pcs', emoji: '🪥' },
            { name: 'Tata Salt 1kg', category: 'Grocery', price: 28, stock: 9, minStock: 20, unit: 'pkt', emoji: '🧂' },
            { name: 'Britannia Bread', category: 'Bakery', price: 45, stock: 18, minStock: 15, unit: 'pkt', emoji: '🍞' },
            { name: 'Dairy Milk 50g', category: 'Snacks', price: 50, stock: 60, minStock: 25, unit: 'pcs', emoji: '🍫' },
            { name: 'Bisleri 1L', category: 'Beverages', price: 20, stock: 88, minStock: 30, unit: 'btl', emoji: '💧' },
            { name: 'Kurkure Masala', category: 'Snacks', price: 20, stock: 52, minStock: 25, unit: 'pkt', emoji: '🌽' },
            { name: 'Haldiram Bhujia', category: 'Snacks', price: 60, stock: 28, minStock: 15, unit: 'pkt', emoji: '🥜' },
            { name: 'Good Day Cookies', category: 'Snacks', price: 30, stock: 36, minStock: 20, unit: 'pkt', emoji: '🍪' },
            { name: 'Oreo Biscuits', category: 'Snacks', price: 30, stock: 44, minStock: 20, unit: 'pkt', emoji: '🍫' },
            { name: 'Amul Butter 100g', category: 'Dairy', price: 56, stock: 18, minStock: 12, unit: 'pkt', emoji: '🧈' },
            { name: 'Pepsi 750ml', category: 'Beverages', price: 40, stock: 24, minStock: 15, unit: 'btl', emoji: '🥤' },
            { name: 'Sprite 750ml', category: 'Beverages', price: 40, stock: 26, minStock: 15, unit: 'btl', emoji: '🥤' },
            { name: 'Tata Tea Gold 500g', category: 'Grocery', price: 280, stock: 16, minStock: 10, unit: 'pkt', emoji: '🍵' },
            { name: 'Aashirvaad Atta 5kg', category: 'Grocery', price: 285, stock: 20, minStock: 12, unit: 'pkt', emoji: '🌾' },
        ];

        const createdProducts = await Product.insertMany(
            products.map((p) => ({ ...p, user: user._id }))
        );
        console.log(`✅ Created ${createdProducts.length} products`);

        // Create sample customers
        console.log('👥 Creating sample customers...');
        const customers = [
            {
                name: 'Ramesh Kumar',
                type: 'Regular',
                address: 'Flat 402, Shivam Apts, Andheri West',
                contact: '+91 9876512345',
                email: 'ramesh.k@email.com',
                totalOrders: 45,
                totalSpent: 12450,
                user: user._id,
            },
            {
                name: 'Priya Sharma',
                type: 'Premium',
                address: 'B-22, Green Park Society, Vile Parle',
                contact: '+91 9988722334',
                email: 'priya.sharma99@email.com',
                totalOrders: 112,
                totalSpent: 45800,
                user: user._id,
            },
            {
                name: 'Amit Patel',
                type: 'Occasional',
                address: 'Shop No 4, Local Market, Borivali',
                contact: '+91 9123455667',
                email: 'amit.p@email.com',
                totalOrders: 8,
                totalSpent: 3200,
                user: user._id,
            },
        ];

        const createdCustomers = await Customer.insertMany(customers);
        console.log(`✅ Created ${createdCustomers.length} customers`);

        // Create sample insights
        console.log('💡 Creating sample insights...');
        const insights = [
            {
                title: 'Maggi is out of stock',
                detail: 'High volume of Maggi 70g noticed in recent bills. Restock at least 40 packets immediately.',
                priority: 'Urgent',
                icon: '⚠️',
                category: 'stock',
                user: user._id,
            },
            {
                title: 'Dairy Milk 50g soaring',
                detail: 'Dairy Milk 50g is the top seller. Increase stock buffer by 30%.',
                priority: 'Opportunity',
                icon: '📈',
                category: 'trend',
                user: user._id,
            },
            {
                title: 'Low stock alert: Tata Salt',
                detail: 'Tata Salt 1kg has only 9 pkt left. Minimum required: 20. Consider reordering.',
                priority: 'Important',
                icon: '📦',
                category: 'stock',
                user: user._id,
            },
        ];

        const createdInsights = await Insight.insertMany(insights);
        console.log(`✅ Created ${createdInsights.length} insights`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Demo Credentials:');
        console.log('   Email: demo@store.com');
        console.log('   Password: demo123');
        console.log('\n🚀 You can now start the server and login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
