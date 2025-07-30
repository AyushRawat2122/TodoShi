import mongoose, { Schema } from "mongoose";

const notifiicationSchema = new Schema({},{timestamps: true});

const Notification = mongoose.model("Notification" , notifiicationSchema);

export default Notification;