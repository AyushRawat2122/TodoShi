import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  const mongoUri = process.env.MONGO_DB_URI;
  
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ Connected to MongoDB successfully 🗄️🚀"))
    .catch((err) => console.error("❌ MongoDB connection error 💥:", err));
  
  console.log(`💻 Server running successfully on port: ${port} 🌐`);
  console.log(`🔗 Access: http://localhost:${port}/`);
});
