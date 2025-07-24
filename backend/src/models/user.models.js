import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, min: 3, max: 20 },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
