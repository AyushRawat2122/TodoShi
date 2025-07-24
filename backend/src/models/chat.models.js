import mongoose, { Schema } from "mongoose";
const chatSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
