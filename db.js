import { MongoClient } from 'mongodb';

// Connection URL - update this with your MongoDB connection string if it's different
const url = 'mongodb://localhost:27017';
const dbName = 'kilobands';

const client = new MongoClient(url);

let db;

export async function connectDB() {
  if (db) return db;
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  }
}
