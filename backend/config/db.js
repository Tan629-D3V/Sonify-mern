/**
 * Database Configuration
 * Part of Music Groovo developed by Tan629
 * Handles MongoDB connection setup
 */

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// Create a new MongoClient with proper SSL configuration
const client = new MongoClient(process.env.MONGO_URI, {
  tls: true,
  retryWrites: true,
  w: 'majority',
});


const conn = await client.connect();
conn.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

export default conn;
