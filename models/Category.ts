import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(), // 👈 Automatically generate ObjectId
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    collection: "categories",
    timestamps: true,
    toJSON: { virtuals: true }, // 👈 Important: return virtuals in JSON
    toObject: { virtuals: true },
  },
);

categorySchema.virtual("category_id").get(function () {
  return this._id;
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
