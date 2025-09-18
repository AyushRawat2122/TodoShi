import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import admin from "firebase-admin";
import http from "http";
import { createSocketServer } from "./config/socket.js";
import registerSocketEvents from "./events/todoshiEvents.js";
dotenv.config({});

const port = process.env.PORT;

// 🔑 Service Initialization Function
const initServices = async () => {
  try {
    // 1️⃣ MongoDB
    const mongoUri = process.env.MONGO_DB_URI;
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully 🗄️🚀");

    // 2️⃣ Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
      timeout: 60000, // 60 seconds timeout
    });
    console.log("✅ Cloudinary configured successfully ☁️");

    // 3️⃣ Firebase Admin SDK
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin SDK initialized successfully 🔥");
    }

    return { mongoose, cloudinary, admin };
  } catch (err) {
    console.error("❌ Service initialization error 💥:", err);
    process.exit(1); // Fail fast
  }
};

// 🖥️ Create HTTP server and attach both REST + Socket.io
const server = http.createServer(app);

// 🔌 Initialize socket server (binds to HTTP server)
createSocketServer(server);
// 🚀 Start server
server.listen(port, async () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  await initServices();
  registerSocketEvents();
});
