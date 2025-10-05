import mongoose, { Schema } from "mongoose";

const logSchema = new Schema(
  {
    description: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", logSchema);
export default Log;
