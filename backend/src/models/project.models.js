import mongoose, { Schema } from "mongoose";
const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, max: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
    deadline: { type: Date },
    activeStatus: { type: Boolean, default: true },
    srsDocFile: {
      publicId: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Project = mongoose.model("Project", projectSchema);
export default Project;
