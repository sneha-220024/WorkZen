const app = require('./src/app');
const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
dotenv.config();


// Set DNS servers to Google DNS to resolve MongoDB Atlas SRV issues
dns.setServers(['8.8.8.8', '8.8.4.4']);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connection successful');
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    });
