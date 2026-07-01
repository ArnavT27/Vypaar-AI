import mongoose from 'mongoose';
import Bill from './models/Bill.js';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const bill = new Bill({
      items: [{
        product: new mongoose.Types.ObjectId(),
        name: 'Test',
        price: 10,
        qty: 1,
        total: 10
      }],
      subtotal: 10,
      gst: 0,
      total: 10,
      user: new mongoose.Types.ObjectId()
    });

    await bill.save();
    console.log('Bill saved!');
  } catch (err) {
    console.log('ERROR:', err.message);
    if (err.errors) {
      console.log('VALIDATION ERRORS:', Object.keys(err.errors).map(k => err.errors[k].message));
    }
  } finally {
    mongoose.disconnect();
  }
}
run();
