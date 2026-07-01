import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Supplier from '../models/Supplier.js';

dotenv.config();

const suppliers = [
    { name: "Aggarwal Kirana Store", type: "Wholesaler", category: "FMCG", city: "Delhi", address: "Sadar Bazaar", phone: "+919820000031", source: "Local Market", topProducts: "Groceries", rating: 4.4 },
    { name: "Mahavir Trading Co", type: "Distributor", category: "FMCG", city: "Mumbai", address: "Crawford Market", phone: "+919820000032", source: "Local Market", topProducts: "Groceries", rating: 4.6 },
    { name: "Shree Ganesh Provision Store", type: "Wholesaler", category: "FMCG", city: "Pune", address: "Market Yard", phone: "+919820000033", source: "Local Market", topProducts: "Groceries", rating: 4.0 },
    { name: "Om Sai Distributors", type: "Distributor", category: "FMCG", city: "Nashik", address: "Wholesale Market", phone: "+919820000034", source: "IndiaMART", topProducts: "Groceries", rating: 4.1 },
    { name: "Rajdhani Traders", type: "Wholesaler", category: "FMCG", city: "Jaipur", address: "Bapu Bazaar", phone: "+919820000035", source: "Local Market", topProducts: "Groceries", rating: 3.8 },
    { name: "Khandelwal Spices", type: "Wholesaler", category: "Spices", city: "Delhi", address: "Khari Baoli", phone: "+919820000036", source: "Local Market", topProducts: "Spices", rating: 4.7 },
    { name: "Gupta Masala Store", type: "Distributor", category: "Spices", city: "Kanpur", address: "Collectorganj", phone: "+919820000037", source: "Local Market", topProducts: "Masala", rating: 4.6 },
    { name: "Surat Spice Hub", type: "Manufacturer", category: "Spices", city: "Surat", address: "GIDC Area", phone: "+919820000038", source: "IndiaMART", topProducts: "Spices", rating: 4.2 },
    { name: "Patel Masala Traders", type: "Wholesaler", category: "Spices", city: "Ahmedabad", address: "Relief Road", phone: "+919820000039", source: "Local Market", topProducts: "Masala", rating: 3.6 },
    { name: "Eastern Spice Suppliers", type: "Distributor", category: "Spices", city: "Kolkata", address: "Burrabazar", phone: "+919820000040", source: "Local Market", topProducts: "Spices", rating: 4.7 },
    { name: "Ravi Dairy Suppliers", type: "Distributor", category: "Dairy", city: "Mumbai", address: "Dadar", phone: "+919820000041", source: "Local Market", topProducts: "Milk", rating: 4.2 },
    { name: "Shiv Dairy Farm", type: "Wholesaler", category: "Dairy", city: "Delhi", address: "Azadpur", phone: "+919820000042", source: "Local Market", topProducts: "Milk", rating: 4.8 },
    { name: "Punjab Milk Traders", type: "Distributor", category: "Dairy", city: "Ludhiana", address: "Industrial Area", phone: "+919820000043", source: "IndiaMART", topProducts: "Milk", rating: 3.7 },
    { name: "Annapurna Dairy Supply", type: "Distributor", category: "Dairy", city: "Indore", address: "Chhoti Gwaltoli", phone: "+919820000044", source: "Local Market", topProducts: "Dairy Products", rating: 4.6 },
    { name: "Fresh Milk Distributors", type: "Distributor", category: "Dairy", city: "Bangalore", address: "Yeshwanthpur", phone: "+919820000045", source: "TradeIndia", topProducts: "Milk", rating: 4.1 },
    { name: "Modern Stationers", type: "Wholesaler", category: "Stationery", city: "Delhi", address: "Chawri Bazaar", phone: "+919820000046", source: "Local Market", topProducts: "Stationery", rating: 4.8 },
    { name: "Shree Stationery Hub", type: "Distributor", category: "Stationery", city: "Mumbai", address: "Masjid Bunder", phone: "+919820000047", source: "Local Market", topProducts: "Stationery", rating: 4.0 },
    { name: "National Paper Traders", type: "Wholesaler", category: "Stationery", city: "Ahmedabad", address: "Relief Road", phone: "+919820000048", source: "IndiaMART", topProducts: "Paper", rating: 3.6 },
    { name: "Kumar Stationers", type: "Distributor", category: "Stationery", city: "Patna", address: "Ashok Rajpath", phone: "+919820000049", source: "Local Market", topProducts: "Stationery", rating: 4.0 },
    { name: "South India Stationery Mart", type: "Wholesaler", category: "Stationery", city: "Chennai", address: "Parrys", phone: "+919820000050", source: "Local Market", topProducts: "Stationery", rating: 3.8 },
    { name: "Om Electronics", type: "Wholesaler", category: "Electronics", city: "Delhi", address: "Nehru Place", phone: "+919820000051", source: "Local Market", topProducts: "Electronics", rating: 4.1 },
    { name: "Tech India Traders", type: "Distributor", category: "Electronics", city: "Bangalore", address: "SP Road", phone: "+919820000052", source: "Local Market", topProducts: "Electronics", rating: 3.8 },
    { name: "Galaxy Electronics", type: "Distributor", category: "Electronics", city: "Mumbai", address: "Lamington Road", phone: "+919820000053", source: "Local Market", topProducts: "Electronics", rating: 3.6 },
    { name: "Rajasthan Electronics Hub", type: "Wholesaler", category: "Electronics", city: "Jaipur", address: "MI Road", phone: "+919820000054", source: "IndiaMART", topProducts: "Electronics", rating: 4.6 },
    { name: "Hyderabad Tech Suppliers", type: "Distributor", category: "Electronics", city: "Hyderabad", address: "CTC Market", phone: "+919820000055", source: "Local Market", topProducts: "Electronics", rating: 4.4 },
    { name: "Shree Plastic House", type: "Wholesaler", category: "Home Goods", city: "Delhi", address: "Sadar Bazaar", phone: "+919820000056", source: "Local Market", topProducts: "Plastic Items", rating: 3.9 },
    { name: "Jain Household Products", type: "Manufacturer", category: "Home Goods", city: "Rajkot", address: "GIDC", phone: "+919820000057", source: "IndiaMART", topProducts: "Household Items", rating: 4.4 },
    { name: "Metro Home Supplies", type: "Distributor", category: "Home Goods", city: "Mumbai", address: "Bhiwandi", phone: "+919820000058", source: "TradeIndia", topProducts: "Home Goods", rating: 4.9 },
    { name: "Kolkata Home Mart", type: "Wholesaler", category: "Home Goods", city: "Kolkata", address: "Burrabazar", phone: "+919820000059", source: "Local Market", topProducts: "Home Goods", rating: 4.4 },
    { name: "Chennai Household Hub", type: "Distributor", category: "Home Goods", city: "Chennai", address: "Parrys", phone: "+919820000060", source: "Local Market", topProducts: "Household Items", rating: 4.3 },
    { name: "Clean India Chemicals", type: "Manufacturer", category: "Cleaning", city: "Ahmedabad", address: "GIDC", phone: "+919820000061", source: "IndiaMART", topProducts: "Cleaning Products", rating: 3.8 },
    { name: "Super Clean Products", type: "Distributor", category: "Cleaning", city: "Delhi", address: "Okhla", phone: "+919820000062", source: "TradeIndia", topProducts: "Cleaning Products", rating: 4.1 },
    { name: "Bright Cleaning Solutions", type: "Wholesaler", category: "Cleaning", city: "Mumbai", address: "Bhiwandi", phone: "+919820000063", source: "Local Market", topProducts: "Cleaning Products", rating: 4.5 },
    { name: "Hygiene Chemicals Pvt Ltd", type: "Manufacturer", category: "Cleaning", city: "Vapi", address: "GIDC", phone: "+919820000064", source: "IndiaMART", topProducts: "Chemicals", rating: 4.9 },
    { name: "Eco Clean Traders", type: "Distributor", category: "Cleaning", city: "Bangalore", address: "Peenya", phone: "+919820000065", source: "TradeIndia", topProducts: "Cleaning Products", rating: 3.8 },
    { name: "Glow Cosmetics Hub", type: "Wholesaler", category: "Cosmetics", city: "Delhi", address: "Sadar Bazaar", phone: "+919820000066", source: "Local Market", topProducts: "Cosmetics", rating: 4.1 },
    { name: "Beauty World Traders", type: "Distributor", category: "Cosmetics", city: "Mumbai", address: "Andheri", phone: "+919820000067", source: "TradeIndia", topProducts: "Cosmetics", rating: 3.7 },
    { name: "Herbal Cosmetics Supplier", type: "Manufacturer", category: "Cosmetics", city: "Ahmedabad", address: "GIDC", phone: "+919820000068", source: "IndiaMART", topProducts: "Herbal Cosmetics", rating: 4.2 },
    { name: "South Beauty Products", type: "Distributor", category: "Cosmetics", city: "Chennai", address: "T Nagar", phone: "+919820000069", source: "Local Market", topProducts: "Beauty Products", rating: 3.9 },
    { name: "Natural Beauty Hub", type: "Wholesaler", category: "Cosmetics", city: "Kolkata", address: "Burrabazar", phone: "+919820000070", source: "Local Market", topProducts: "Cosmetics", rating: 4.7 },
    { name: "Cool Drinks Distributor", type: "Distributor", category: "Beverages", city: "Delhi", address: "Okhla", phone: "+919820000071", source: "IndiaMART", topProducts: "Beverages", rating: 3.8 },
    { name: "Fresh Juice Traders", type: "Wholesaler", category: "Beverages", city: "Mumbai", address: "Bhiwandi", phone: "+919820000072", source: "Local Market", topProducts: "Juices", rating: 4.8 },
    { name: "Hyd Drinks Supplier", type: "Distributor", category: "Beverages", city: "Hyderabad", address: "Kukatpally", phone: "+919820000073", source: "TradeIndia", topProducts: "Beverages", rating: 4.4 },
    { name: "South Beverages Hub", type: "Distributor", category: "Beverages", city: "Chennai", address: "Guindy", phone: "+919820000074", source: "Local Market", topProducts: "Beverages", rating: 4.4 },
    { name: "Kolkata Beverage Traders", type: "Wholesaler", category: "Beverages", city: "Kolkata", address: "Burrabazar", phone: "+919820000075", source: "Local Market", topProducts: "Beverages", rating: 4.0 },
    { name: "Balaji Distributors", type: "Wholesaler", category: "FMCG", city: "Bhiwandi", address: "Mankoli Naka Bhiwandi", phone: "+919820000001", source: "IndiaMART", topProducts: "FMCG Products", rating: 4.2 },
    { name: "Piyush Marketing", type: "Distributor", category: "Grocery", city: "Navi Mumbai", address: "APMC Market Vashi", phone: "+919820000002", source: "Justdial", topProducts: "Groceries", rating: 3.6 },
    { name: "Faridi Impex Pvt Ltd", type: "Distributor", category: "FMCG", city: "Mumbai", address: "Masjid Bunder", phone: "+919820000003", source: "Justdial", topProducts: "FMCG Products", rating: 4.9 },
    { name: "Disha Trading Company", type: "Wholesaler", category: "FMCG", city: "Thane", address: "Kalher Bhiwandi", phone: "+919820000004", source: "Local Market", topProducts: "FMCG Products", rating: 3.5 },
    { name: "Laxmi Stationery Mart", type: "Wholesaler", category: "Stationery", city: "Mumbai", address: "Masjid Bunder", phone: "+919820000005", source: "Local Market", topProducts: "Stationery", rating: 4.4 },
    { name: "Gupta Stationers", type: "Wholesaler", category: "Stationery", city: "Delhi", address: "Chawri Bazaar", phone: "+919820000006", source: "Local Market", topProducts: "Stationery", rating: 4.7 },
    { name: "Raj Electronics", type: "Distributor", category: "Electronics", city: "Delhi", address: "Nehru Place", phone: "+919820000007", source: "Local Market", topProducts: "Electronics", rating: 4.8 },
    { name: "Sharma Electricals", type: "Wholesaler", category: "Electronics", city: "Mumbai", address: "Lohar Chawl", phone: "+919820000008", source: "Local Market", topProducts: "Electrical Items", rating: 3.8 },
    { name: "Khan Mobile Accessories", type: "Wholesaler", category: "Electronics", city: "Delhi", address: "Nehru Place", phone: "+919820000009", source: "IndiaMART", topProducts: "Mobile Accessories", rating: 3.8 },
    { name: "Sadar Plastic House", type: "Wholesaler", category: "Home Goods", city: "Delhi", address: "Sadar Bazaar", phone: "+919820000010", source: "Local Market", topProducts: "Plastic Items", rating: 3.5 },
    { name: "Jain Plastics", type: "Manufacturer", category: "Home Goods", city: "Rajkot", address: "GIDC Area", phone: "+919820000011", source: "IndiaMART", topProducts: "Plastic Products", rating: 4.6 },
    { name: "Supreme Household Suppliers", type: "Distributor", category: "Home Goods", city: "Mumbai", address: "Bhiwandi", phone: "+919820000012", source: "TradeIndia", topProducts: "Household Items", rating: 3.8 },
    { name: "Vapi Chemicals Pvt Ltd", type: "Manufacturer", category: "Cleaning", city: "Vapi", address: "GIDC Industrial Area", phone: "+919820000013", source: "IndiaMART", topProducts: "Chemicals", rating: 4.7 },
    { name: "Kanpur Detergent Works", type: "Manufacturer", category: "Cleaning", city: "Kanpur", address: "Industrial Area", phone: "+919820000014", source: "Local Market", topProducts: "Detergent", rating: 4.9 },
    { name: "Rohit Surfactants Distributor", type: "Distributor", category: "Cleaning", city: "Delhi", address: "Okhla", phone: "+919820000015", source: "TradeIndia", topProducts: "Cleaning Products", rating: 3.7 },
    { name: "MDH Distributor Delhi", type: "Distributor", category: "Spices", city: "Delhi", address: "Khari Baoli", phone: "+919820000016", source: "Local Market", topProducts: "MDH Spices", rating: 4.7 },
    { name: "Everest Masala Distributor", type: "Distributor", category: "Spices", city: "Mumbai", address: "Crawford Market", phone: "+919820000017", source: "Local Market", topProducts: "Everest Masala", rating: 3.6 },
    { name: "Aachi Masala Supplier", type: "Distributor", category: "Spices", city: "Chennai", address: "Koyambedu", phone: "+919820000018", source: "IndiaMART", topProducts: "Aachi Masala", rating: 3.9 },
    { name: "Ramdev Masala Traders", type: "Wholesaler", category: "Spices", city: "Ahmedabad", address: "Relief Road", phone: "+919820000019", source: "Local Market", topProducts: "Masala", rating: 4.3 },
    { name: "Sumin Enterprises", type: "Wholesaler", category: "Spices", city: "Mumbai", address: "Borivali", phone: "+919820000020", source: "IndiaMART", topProducts: "Spices", rating: 4.4 },
    { name: "Himalaya Distributor", type: "Distributor", category: "Cosmetics", city: "Bangalore", address: "Peenya", phone: "+919820000021", source: "TradeIndia", topProducts: "Himalaya Products", rating: 4.3 },
    { name: "Lotus Herbals Supplier", type: "Distributor", category: "Cosmetics", city: "Delhi", address: "Karol Bagh", phone: "+919820000022", source: "IndiaMART", topProducts: "Lotus Herbals", rating: 4.4 },
    { name: "VLCC Products Distributor", type: "Distributor", category: "Cosmetics", city: "Mumbai", address: "Andheri", phone: "+919820000023", source: "TradeIndia", topProducts: "VLCC Products", rating: 3.8 },
    { name: "Local Cosmetic Hub", type: "Wholesaler", category: "Cosmetics", city: "Delhi", address: "Sadar Bazaar", phone: "+919820000024", source: "Local Market", topProducts: "Cosmetics", rating: 4.8 },
    { name: "Amul Distributor Mumbai", type: "Distributor", category: "Dairy", city: "Mumbai", address: "Goregaon", phone: "+919820000025", source: "Local Market", topProducts: "Amul Products", rating: 3.7 },
    { name: "Mother Dairy Distributor", type: "Distributor", category: "Dairy", city: "Delhi", address: "Patparganj", phone: "+919820000026", source: "Local Market", topProducts: "Mother Dairy", rating: 3.6 },
    { name: "Heritage Milk Supplier", type: "Distributor", category: "Dairy", city: "Hyderabad", address: "Kukatpally", phone: "+919820000027", source: "IndiaMART", topProducts: "Heritage Milk", rating: 3.8 },
    { name: "Milky Mist Distributor", type: "Distributor", category: "Dairy", city: "Coimbatore", address: "Industrial Area", phone: "+919820000028", source: "TradeIndia", topProducts: "Milky Mist", rating: 4.2 },
    { name: "Bisleri Distributor", type: "Distributor", category: "Beverages", city: "Mumbai", address: "Bhiwandi", phone: "+919820000029", source: "Local Market", topProducts: "Bisleri Water", rating: 4.0 },
    { name: "Paper Boat Distributor", type: "Distributor", category: "Beverages", city: "Delhi", address: "Okhla", phone: "+919820000030", source: "IndiaMART", topProducts: "Paper Boat Drinks", rating: 4.3 },
];

console.log('🌱 Initializing seed script...\n');

const seedSuppliers = async () => {
    try {
        console.log('🚀 Starting supplier seeding process...');
        console.log('📍 Connecting to MongoDB...');

        await mongoose.connect(process.env.MONGO_URI, { dbName: 'retail_store' });
        console.log('✅ MongoDB Connected successfully!');

        console.log('🗑️  Clearing existing suppliers...');
        const deleteResult = await Supplier.deleteMany();
        console.log(`✅ Deleted ${deleteResult.deletedCount} existing suppliers`);

        console.log('📦 Inserting new suppliers...');
        const result = await Supplier.insertMany(suppliers);
        console.log(`✅ ${result.length} suppliers seeded successfully!`);

        console.log('\n🎉 Seeding completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - Total suppliers: ${result.length}`);
        console.log(`   - Categories: FMCG, Grocery, Dairy, Stationery, Electronics, Home Goods, Cleaning, Spices, Cosmetics, Beverages`);
        console.log(`   - Sources: Local Market, IndiaMART, TradeIndia, Justdial`);
        console.log(`   - Cities: Delhi, Mumbai, Pune, Nashik, Jaipur, Kanpur, Surat, Ahmedabad, Kolkata, Bangalore, Chennai, Ludhiana, Indore, Patna, Hyderabad, Rajkot, Vapi, Bhiwandi, Navi Mumbai, Thane, Coimbatore`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding suppliers:', error.message);
        console.error('📋 Full error:', error);
        process.exit(1);
    }
};

seedSuppliers();
