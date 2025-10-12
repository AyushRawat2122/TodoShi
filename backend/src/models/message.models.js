import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema(
  {
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    attachment: { type: { public_id: String, url: String }, default: null },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;
