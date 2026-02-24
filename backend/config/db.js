const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('[Config Error] MONGO_URI is missing in .env file');
        process.exit(1);
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[Database] MongoDB Connected to host: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database Error] Connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
