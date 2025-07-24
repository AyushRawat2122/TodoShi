import mongoose, { Schema } from "mongoose";
const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, max: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    deadline: { type: Date, required: true },
    activeStatus: { type: Boolean, default: true },
    srsDocFile: { type: String, default: "" },
    todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
  },
  { timestamps: true }
);
const Project = mongoose.model("Project", projectSchema);
export default Project;
