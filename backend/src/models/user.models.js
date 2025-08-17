import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    firebaseUID: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, min: 3, max: 20 },
    role: { type: String, required: true, default: "student" },
    avatar: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    banner: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    skills: { type: [String], default: [] },
    about: {
      type: Object,
      default: {
        description: "",
        github: "",
        linkedIn: "",
        location: "",
        x: "",
        portfolio: "",
      },
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
