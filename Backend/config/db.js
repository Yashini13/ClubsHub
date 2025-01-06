const mongoose = require('mongoose');
require('dotenv').config();

MONGODB_URI = 'mongodb+srv://vaishnavit582:1BxjODQucUskfy90@cluster1.sxekl4d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,  
    });

    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
 
    process.exit(1);
  }
};

module.exports = connectDB;