import mongoose, { Schema } from "mongoose";
const todoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    staus: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
