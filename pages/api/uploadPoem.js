import { connectDB } from "../../lib/mongodb";
// import mongoose from "mongoose";
import Poem from "./../../models/Poem";
import UserAccount from "../../models/UserAccount";
import Category from "../../models/Category";

const handler = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    const requiredFields = ["title", "content", "categoryID"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const { title, content, user_email, categoryID } = req.body;
    const findEmail = await UserAccount.findOne({ email: user_email });
    const findCategory = await Category.findOne({ _id: categoryID });

    try {
      const newPoem = await Poem.create({
        poemTitle: title,
        content,
        user_id: findEmail._id,
        category_id: findCategory._id,
      });

      res.status(201).json({ message: "Poem uploaded successfully", poem: newPoem, success: true });
    } catch (error) {
      console.error("UploadPoem error:", error);
      res.status(500).json({ message: "Error uploading poem", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
