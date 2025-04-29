const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
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
// const mongoose = require('mongoose');
// require('dotenv').config();

// console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB Connected Successfully');
//   } catch (error) {
//     console.error('MongoDB Connection Error:', error.message);
//     process.exit(1);
//   }
// };

module.exports = connectDB;
