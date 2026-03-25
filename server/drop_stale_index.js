const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dropStaleIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/workzen');
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('employees');

        // Drop the stale index employee_id_1 if it exists
        try {
            await collection.dropIndex('employee_id_1');
            console.log('Successfully dropped stale index: employee_id_1');
        } catch (err) {
            if (err.codeName === 'IndexNotFound' || err.code === 27) {
                console.log('Index employee_id_1 not found, skipping...');
            } else {
                throw err;
            }
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error dropping index:', error);
        process.exit(1);
    }
};

dropStaleIndex();
