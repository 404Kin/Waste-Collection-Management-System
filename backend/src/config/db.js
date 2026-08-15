const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is missing in .env file!');
      console.error(' Please add: MONGODB_URI=mongodb://localhost:27017/waste_collection');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      
    });

    console.log(` MongoDB Connected Successfully!`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(` Port: ${conn.connection.port}`);
    
    // Connection Events (Optional but good for debugging)
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(' MongoDB disconnected!');
    });

    return conn;
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;