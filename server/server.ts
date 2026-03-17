import app from './src/app';
import connectDB from './src/config/db';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Starts the Node.js server.
 * First connects to MongoDB Atlas, then listens on the specified port.
 */
const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
