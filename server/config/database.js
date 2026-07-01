import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDatabase = async () => {
    try {
        let DB = process.env.MONGO_URI || process.env.DATABASE;

        if (!DB) {
            throw new Error('Database connection string is missing. Please define DATABASE or MONGO_URI in your environment variables.');
        }

        if (process.env.DATABASE && process.env.DATABASE_PASSWORD) {
            DB = process.env.DATABASE.replace(
                '<PASSWORD>',
                process.env.DATABASE_PASSWORD
            );
        }

        const conn = await mongoose.connect(DB, {
            dbName: 'retail_store',
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDatabase;
