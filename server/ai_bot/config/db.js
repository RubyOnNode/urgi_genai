// src/config/db.js  
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database;

async function connectDB() {
  if (!database) {
    await client.connect();
    database = client.db(); // Uses the default database from URI  
    console.log('Connected to MongoDB');
  }
  return database;
}

connectDB().catch(error => {
  console.error('Failed to connect to MongoDB', error);
  process.exit(1);
});

module.exports = {
  database: client.db(), // Ensure this is connected  
};  