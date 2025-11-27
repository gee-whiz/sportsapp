const mongoose = require('mongoose');

const connectDB = async () => {
  // Default DB name aligns to the existing Atlas/local database (override via MONGO_URI for clusters)
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sportsapp';
  console.log(`Connecting to MongoDB at: ${uri}`);
  await mongoose.connect(uri);
  return mongoose.connection;
};

module.exports = connectDB;
