import mongoose, { Schema } from "mongoose";
const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, max: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
      validate: {
        validator: function (val) {
          return val.length <= 10; // max 10 collaborators allowed
        },
        message: "You can add up to 10 collaborators only.",
      },
    },
    deadline: { type: Date },
    activeStatus: { type: Boolean, default: true },
    srsDocFile: {
      publicId: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    ProjectImage: {
      publicId: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    links: {
      type: [
        {
          name: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      default: [],
      validate: {
        validator: function (val) {
          return val.length <= 5; // max 5 Links allowed
        },
        message: "You can add up to 5 links only.",
      },
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Project = mongoose.model("Project", projectSchema);
export default Project;
