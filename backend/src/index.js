import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({});

const port = process.env.PORT;

app.listen(port, () => {
  const mongoUri = process.env.MONGO_DB_URI;

  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ Connected to MongoDB successfully 🗄️🚀"))
    .then(() => {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
      console.log("✅ Cloudinary configured successfully ☁️");
    })
    .catch((err) => console.error("❌ MongoDB / Cloudinary connection error 💥:", err));

  console.log(`💻 Server running successfully on port: ${port} 🌐`);
  console.log(`🔗 Access: http://localhost:${port}/`);
});
