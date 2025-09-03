import mongoose from "mongoose";

const MAX_CONTENT_BYTES = 15 * 1024 * 1024; // 15 MB

const poemSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(), // 👈 Automatically generate ObjectId
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    poemTitle:{
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          // calculate byte size using Buffer
          return Buffer.byteLength(v, "utf8") <= MAX_CONTENT_BYTES;
        },
        message: `Content is too large. Maximum allowed size is 15MB.`,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "poems",
    timestamps: true,
    toJSON: { virtuals: true }, // 👈 Important: return virtuals in JSON
    toObject: { virtuals: true },
  },
);

poemSchema.virtual("poem_id").get(function () {
  return this._id;
});
// 👇 Important: force refresh model if schema updated
// delete mongoose.models.Poem;
// const Poem = mongoose.model("Poem", poemSchema);
const Poem = mongoose.models.Poem || mongoose.model("Poem", poemSchema);

export default Poem;
