import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema(
  {
    room_id: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;
