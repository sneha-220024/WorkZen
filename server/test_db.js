const mongoose = require('mongoose');

async function checkDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/');
        const db = mongoose.connection.db;
        const dbName = db.databaseName;
        console.log('Connected to Database:', dbName);

        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name).join(', '));

        const employeesCount = await db.collection('employees').countDocuments();
        console.log('Total Employees:', employeesCount);

        const hrsCount = await db.collection('hrs').countDocuments();
        console.log('Total HRs:', hrsCount);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
checkDB();
