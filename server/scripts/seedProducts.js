import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const products = [
    { name: "Parle-G Biscuit", category: "Snacks", price: 10, stock: 48, minStock: 20, unit: "pkt", emoji: "🍪" },
    { name: "Amul Milk 500ml", category: "Dairy", price: 30, stock: 12, minStock: 25, unit: "pkt", emoji: "🥛" },
    { name: "Coca-Cola 750ml", category: "Beverages", price: 40, stock: 6, minStock: 15, unit: "btl", emoji: "🥤" },
    { name: "Lays Classic", category: "Snacks", price: 20, stock: 75, minStock: 30, unit: "pkt", emoji: "🥔" },
    { name: "Maggi 70g", category: "Grocery", price: 14, stock: 0, minStock: 20, unit: "pkt", emoji: "🍜" },
    { name: "Surf Excel 1kg", category: "Household", price: 165, stock: 22, minStock: 10, unit: "pkt", emoji: "🧺" },
    { name: "Colgate 100g", category: "Personal Care", price: 55, stock: 34, minStock: 15, unit: "pcs", emoji: "🪥" },
    { name: "Tata Salt 1kg", category: "Grocery", price: 28, stock: 9, minStock: 20, unit: "pkt", emoji: "🧂" },
    { name: "Britannia Bread", category: "Bakery", price: 45, stock: 18, minStock: 15, unit: "pkt", emoji: "🍞" },
    { name: "Dairy Milk 50g", category: "Snacks", price: 50, stock: 60, minStock: 25, unit: "pcs", emoji: "🍫" },
    { name: "Bingo Mad Angles", category: "Snacks", price: 20, stock: 40, minStock: 20, unit: "pkt", emoji: "🌶️" },
    { name: "Bisleri 1L", category: "Beverages", price: 20, stock: 88, minStock: 30, unit: "btl", emoji: "💧" },
    { name: "Kurkure Masala", category: "Snacks", price: 20, stock: 52, minStock: 25, unit: "pkt", emoji: "🌽" },
    { name: "Haldiram Bhujia", category: "Snacks", price: 60, stock: 28, minStock: 15, unit: "pkt", emoji: "🥜" },
    { name: "Good Day Cookies", category: "Snacks", price: 30, stock: 36, minStock: 20, unit: "pkt", emoji: "🍪" },
    { name: "Oreo Biscuits", category: "Snacks", price: 30, stock: 44, minStock: 20, unit: "pkt", emoji: "🍫" },
    { name: "Marie Gold", category: "Snacks", price: 25, stock: 30, minStock: 15, unit: "pkt", emoji: "🍪" },
    { name: "Amul Butter 100g", category: "Dairy", price: 56, stock: 18, minStock: 12, unit: "pkt", emoji: "🧈" },
    { name: "Amul Cheese Slice", category: "Dairy", price: 125, stock: 14, minStock: 10, unit: "pkt", emoji: "🧀" },
    { name: "Mother Dairy Curd 400g", category: "Dairy", price: 45, stock: 22, minStock: 15, unit: "pkt", emoji: "🥛" },
    { name: "Amul Lassi 200ml", category: "Dairy", price: 25, stock: 30, minStock: 20, unit: "btl", emoji: "🥤" },
    { name: "Pepsi 750ml", category: "Beverages", price: 40, stock: 24, minStock: 15, unit: "btl", emoji: "🥤" },
    { name: "Sprite 750ml", category: "Beverages", price: 40, stock: 26, minStock: 15, unit: "btl", emoji: "🥤" },
    { name: "Frooti 250ml", category: "Beverages", price: 20, stock: 50, minStock: 25, unit: "btl", emoji: "🥭" },
    { name: "Real Mixed Fruit 1L", category: "Beverages", price: 110, stock: 12, minStock: 8, unit: "btl", emoji: "🧃" },
    { name: "Red Bull 250ml", category: "Beverages", price: 125, stock: 18, minStock: 10, unit: "btl", emoji: "⚡" },
    { name: "Tata Tea Gold 500g", category: "Grocery", price: 280, stock: 16, minStock: 10, unit: "pkt", emoji: "🍵" },
    { name: "Bru Coffee 100g", category: "Grocery", price: 195, stock: 14, minStock: 8, unit: "btl", emoji: "☕" },
    { name: "Aashirvaad Atta 5kg", category: "Grocery", price: 285, stock: 20, minStock: 12, unit: "pkt", emoji: "🌾" },
    { name: "Fortune Sunflower Oil 1L", category: "Grocery", price: 165, stock: 18, minStock: 10, unit: "btl", emoji: "🛢️" },
    { name: "Daawat Basmati 1kg", category: "Grocery", price: 130, stock: 24, minStock: 12, unit: "pkt", emoji: "🍚" },
    { name: "Tata Sampann Dal 1kg", category: "Grocery", price: 145, stock: 22, minStock: 12, unit: "pkt", emoji: "🫘" },
    { name: "MDH Garam Masala", category: "Grocery", price: 85, stock: 30, minStock: 15, unit: "pkt", emoji: "🌶️" },
    { name: "Catch Black Pepper", category: "Grocery", price: 95, stock: 18, minStock: 10, unit: "pkt", emoji: "⚫" },
    { name: "Madhur Sugar 1kg", category: "Grocery", price: 48, stock: 26, minStock: 15, unit: "pkt", emoji: "🍬" },
    { name: "Saffola Honey 250g", category: "Grocery", price: 180, stock: 12, minStock: 8, unit: "btl", emoji: "🍯" },
    { name: "Kissan Mixed Fruit Jam", category: "Grocery", price: 130, stock: 16, minStock: 10, unit: "btl", emoji: "🍓" },
    { name: "Maggi Ketchup 1kg", category: "Grocery", price: 145, stock: 14, minStock: 8, unit: "btl", emoji: "🍅" },
    { name: "Vim Bar 200g", category: "Household", price: 20, stock: 60, minStock: 25, unit: "pcs", emoji: "🧼" },
    { name: "Harpic 500ml", category: "Household", price: 95, stock: 22, minStock: 12, unit: "btl", emoji: "🚽" },
    { name: "Lizol 500ml", category: "Household", price: 110, stock: 18, minStock: 10, unit: "btl", emoji: "🧴" },
    { name: "Good Knight Refill", category: "Household", price: 75, stock: 26, minStock: 15, unit: "pcs", emoji: "🦟" },
    { name: "Tide 1kg", category: "Household", price: 155, stock: 20, minStock: 10, unit: "pkt", emoji: "🧺" },
    { name: "Lifebuoy Soap", category: "Personal Care", price: 30, stock: 70, minStock: 30, unit: "pcs", emoji: "🧼" },
    { name: "Dove Soap 100g", category: "Personal Care", price: 65, stock: 38, minStock: 20, unit: "pcs", emoji: "🛁" },
    { name: "Head & Shoulders 180ml", category: "Personal Care", price: 195, stock: 16, minStock: 10, unit: "btl", emoji: "💆" },
    { name: "Clinic Plus 175ml", category: "Personal Care", price: 110, stock: 22, minStock: 12, unit: "btl", emoji: "🧴" },
    { name: "Pepsodent 150g", category: "Personal Care", price: 65, stock: 28, minStock: 15, unit: "pcs", emoji: "🪥" },
    { name: "Gillette Razor", category: "Personal Care", price: 145, stock: 14, minStock: 8, unit: "pcs", emoji: "🪒" },
    { name: "Nivea Cream 100ml", category: "Personal Care", price: 175, stock: 16, minStock: 10, unit: "btl", emoji: "🧴" },
    { name: "Whisper Pads 15s", category: "Personal Care", price: 95, stock: 24, minStock: 12, unit: "pkt", emoji: "🌸" },
    { name: "Pampers Diapers", category: "Personal Care", price: 299, stock: 12, minStock: 8, unit: "pkt", emoji: "👶" },
    { name: "Britannia Cake", category: "Bakery", price: 30, stock: 28, minStock: 15, unit: "pcs", emoji: "🧁" },
    { name: "Modern Brown Bread", category: "Bakery", price: 50, stock: 14, minStock: 10, unit: "pkt", emoji: "🍞" },
    { name: "Veeba Mayo 250g", category: "Grocery", price: 110, stock: 18, minStock: 10, unit: "btl", emoji: "🥪" },
    { name: "boAt Rockerz 450 Headphones", category: "Electronics", price: 1499, stock: 8, minStock: 5, unit: "pcs", emoji: "🎧" },
    { name: "Mi Power Bank 10000mAh", category: "Electronics", price: 999, stock: 14, minStock: 6, unit: "pcs", emoji: "🔋" },
    { name: "Realme Buds Wireless", category: "Electronics", price: 1799, stock: 6, minStock: 5, unit: "pcs", emoji: "🎧" },
    { name: "USB-C Cable 1m", category: "Electronics", price: 199, stock: 40, minStock: 20, unit: "pcs", emoji: "🔌" },
    { name: "Mobile Charger 20W", category: "Electronics", price: 599, stock: 18, minStock: 10, unit: "pcs", emoji: "⚡" },
    { name: "LED Bulb 9W Philips", category: "Electronics", price: 120, stock: 36, minStock: 20, unit: "pcs", emoji: "💡" },
    { name: "Extension Board 4-Plug", category: "Electronics", price: 449, stock: 10, minStock: 6, unit: "pcs", emoji: "🔌" },
    { name: "Duracell AA Battery 4pk", category: "Electronics", price: 180, stock: 28, minStock: 15, unit: "pkt", emoji: "🔋" },
    { name: "Bluetooth Speaker Mini", category: "Electronics", price: 899, stock: 9, minStock: 5, unit: "pcs", emoji: "🔊" },
    { name: "Smart Watch Fire-Boltt", category: "Electronics", price: 1599, stock: 5, minStock: 4, unit: "pcs", emoji: "⌚" },
    { name: "Earphones Wired boAt", category: "Electronics", price: 399, stock: 24, minStock: 12, unit: "pcs", emoji: "🎧" },
    { name: "Memory Card 32GB", category: "Electronics", price: 349, stock: 16, minStock: 8, unit: "pcs", emoji: "💾" },
    { name: "Men's Cotton T-Shirt", category: "Clothing", price: 349, stock: 22, minStock: 12, unit: "pcs", emoji: "👕" },
    { name: "Women's Kurti", category: "Clothing", price: 599, stock: 14, minStock: 8, unit: "pcs", emoji: "👗" },
    { name: "Kids Shorts", category: "Clothing", price: 249, stock: 18, minStock: 10, unit: "pcs", emoji: "🩳" },
    { name: "Men's Jeans", category: "Clothing", price: 899, stock: 10, minStock: 6, unit: "pcs", emoji: "👖" },
    { name: "Cotton Socks 3-pair", category: "Clothing", price: 199, stock: 30, minStock: 15, unit: "pkt", emoji: "🧦" },
    { name: "Bath Towel", category: "Clothing", price: 299, stock: 16, minStock: 8, unit: "pcs", emoji: "🛁" },
    { name: "Bedsheet Double", category: "Clothing", price: 749, stock: 8, minStock: 5, unit: "pcs", emoji: "🛏️" },
    { name: "School Uniform Shirt", category: "Clothing", price: 399, stock: 20, minStock: 10, unit: "pcs", emoji: "👔" },
    { name: "Saree Cotton Print", category: "Clothing", price: 1299, stock: 6, minStock: 4, unit: "pcs", emoji: "🥻" },
    { name: "Winter Cap Wool", category: "Clothing", price: 199, stock: 24, minStock: 12, unit: "pcs", emoji: "🧢" },
    { name: "Inner Vest Pack of 3", category: "Clothing", price: 299, stock: 18, minStock: 10, unit: "pkt", emoji: "👕" },
    { name: "Handkerchief Set", category: "Clothing", price: 99, stock: 40, minStock: 20, unit: "pkt", emoji: "🧻" },
    { name: "Hot Wheels Car", category: "Toys", price: 149, stock: 28, minStock: 12, unit: "pcs", emoji: "🚗" },
    { name: "Lego Building Blocks", category: "Toys", price: 599, stock: 10, minStock: 6, unit: "pkt", emoji: "🧱" },
    { name: "Barbie Doll", category: "Toys", price: 799, stock: 8, minStock: 5, unit: "pcs", emoji: "👸" },
    { name: "Teddy Bear Medium", category: "Toys", price: 449, stock: 12, minStock: 6, unit: "pcs", emoji: "🧸" },
    { name: "Cricket Bat Plastic", category: "Toys", price: 249, stock: 16, minStock: 8, unit: "pcs", emoji: "🏏" },
    { name: "Football Size 5", category: "Toys", price: 399, stock: 10, minStock: 6, unit: "pcs", emoji: "⚽" },
    { name: "Carrom Board Mini", category: "Toys", price: 899, stock: 6, minStock: 4, unit: "pcs", emoji: "🎯" },
    { name: "Ludo Board Game", category: "Toys", price: 199, stock: 18, minStock: 10, unit: "pcs", emoji: "🎲" },
    { name: "Puzzle 100 Pieces", category: "Toys", price: 299, stock: 14, minStock: 8, unit: "pcs", emoji: "🧩" },
    { name: "Remote Control Car", category: "Toys", price: 1299, stock: 5, minStock: 3, unit: "pcs", emoji: "🚙" },
    { name: "Coloring Book Set", category: "Toys", price: 149, stock: 32, minStock: 15, unit: "pcs", emoji: "🎨" },
    { name: "Stuffed Unicorn", category: "Toys", price: 499, stock: 9, minStock: 5, unit: "pcs", emoji: "🦄" },
    { name: "Yo-Yo Pro", category: "Toys", price: 99, stock: 24, minStock: 12, unit: "pcs", emoji: "🪀" },
    { name: "Skipping Rope", category: "Toys", price: 149, stock: 20, minStock: 10, unit: "pcs", emoji: "🪢" },
    { name: "Magic Slate", category: "Toys", price: 179, stock: 22, minStock: 10, unit: "pcs", emoji: "📝" },
    { name: "Classmate Notebook", category: "Stationery", price: 60, stock: 50, minStock: 25, unit: "pcs", emoji: "📓" },
    { name: "Reynolds Pen 5pk", category: "Stationery", price: 50, stock: 40, minStock: 20, unit: "pkt", emoji: "🖊️" },
    { name: "Camlin Pencil Box", category: "Stationery", price: 199, stock: 18, minStock: 10, unit: "pcs", emoji: "✏️" },
    { name: "Geometry Box", category: "Stationery", price: 149, stock: 16, minStock: 8, unit: "pcs", emoji: "📐" },
    { name: "A4 Paper Ream", category: "Stationery", price: 320, stock: 12, minStock: 6, unit: "pkt", emoji: "📄" },
    { name: "Sticky Notes", category: "Stationery", price: 80, stock: 30, minStock: 15, unit: "pkt", emoji: "🗒️" },
    { name: "Glue Stick Fevistik", category: "Stationery", price: 35, stock: 44, minStock: 20, unit: "pcs", emoji: "🩹" },
    { name: "Stapler with Pins", category: "Stationery", price: 199, stock: 14, minStock: 8, unit: "pcs", emoji: "📎" },
];

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        const dbUri = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
        await mongoose.connect(dbUri, { dbName: 'retail_store' });
        console.log('✅ Connected to MongoDB');

        // Get the first user (or create a demo user if none exists)
        let user = await User.findOne();

        if (!user) {
            console.log('⚠️  No users found. Please register a user first or run the seed script.');
            console.log('   Run: npm run seed (to create demo user)');
            process.exit(1);
        }

        console.log(`👤 Using user: ${user.name} (${user.email})`);

        // Clear existing products for this user
        await Product.deleteMany({ user: '69f64ab98919128a3be94296' });
        console.log('🗑️  Cleared existing products');

        // Add user to each product
        const productsWithUser = products.map(p => ({
            ...p,
            user: user._id
        }));

        // Insert products
        const result = await Product.insertMany(productsWithUser);
        console.log(`✅ Added ${result.length} products to database`);

        console.log('\n📦 Sample products:');
        result.slice(0, 5).forEach(p => {
            console.log(`   ${p.emoji} ${p.name} - ₹${p.price} (Stock: ${p.stock})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
