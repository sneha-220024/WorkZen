import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AttendanceService from './src/services/AttendanceService';
import Attendance from './src/models/Attendance';
import Employee from './src/models/Employee';

dotenv.config();
const uri = process.env.MONGO_URI || '';

mongoose.connect(uri).then(async () => {
    try {
        const emp = await Employee.findOne({});
        console.log("Found emp:", emp?.email);
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        console.log("Deleting today's attendances...");
        await Attendance.deleteMany({ date: { $gte: today } });
        
        console.log("Checking in...");
        const attIn = await AttendanceService.checkIn(emp!._id.toString());
        console.log("Check-in success", attIn.checkInTime);
        
        console.log("Checking out...");
        const attOut = await AttendanceService.checkOut(emp!._id.toString());
        console.log("Check-out success", attOut.checkOutTime);
    } catch(err) {
        console.error("Test failed:", err);
    }
    mongoose.disconnect();
});
