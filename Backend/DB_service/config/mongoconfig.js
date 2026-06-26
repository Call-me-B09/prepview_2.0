import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const dbName = "prepview2_0";
    console.log(`[DB Service] [MongoDB] Attempting to connect to database: "${dbName}"...`);
    
    // Enable Mongoose query debug logging
    mongoose.set("debug", (collectionName, method, query, doc) => {
      console.log(`[DB Service] [Mongoose] Query: db.${collectionName}.${method}(${JSON.stringify(query)})`);
    });

    await mongoose.connect(`${process.env.Mongodb}/${dbName}`);
    console.log("[DB Service] [MongoDB] Connected successfully to MongoDB!");
  } catch (err) {
    console.error("[DB Service] [MongoDB] Connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;