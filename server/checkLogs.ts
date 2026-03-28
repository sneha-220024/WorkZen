import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || '';

mongoose.connect(uri).then(async () => {
    const db = mongoose.connection.db;
    const records = await db.collection('attendances').find().sort({ date: -1 }).limit(5).toArray();
    console.log("Last 5 Attendances:");
    records.forEach(r => {
        console.log(`Date: ${r.date}, CheckIn: ${r.checkInTime}, CheckOut: ${r.checkOutTime}`);
    });
    mongoose.disconnect();
});
