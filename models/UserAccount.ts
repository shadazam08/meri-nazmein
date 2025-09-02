import mongoose from "mongoose";

const userAccountSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(), // 👈 Automatically generate ObjectId
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    penName: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "user_accounts",
    timestamps: true,
    toJSON: { virtuals: true }, // 👈 Important: return virtuals in JSON
    toObject: { virtuals: true },
  }
);

userAccountSchema.virtual("user_id").get(function () {
  return this._id;
});

const UserAccount = mongoose.models.UserAccount || mongoose.model("UserAccount", userAccountSchema);

export default UserAccount;
