import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || '';

mongoose.connect(uri).then(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const db = mongoose.connection.db;
    await db.collection('attendances').deleteMany({ date: { $gte: today } });
    console.log("Deleted today's attendances...");
    mongoose.disconnect();
});
