import { connectDB } from "../../lib/mongodb";
import Category from "../../models/Category";

const handler = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    const requiredFields = ["name"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const { name } = req.body;

    const findCategory = await Category.findOne({ name });

    if (findCategory) {
      return res.status(409).json({ error: "Category already exists" });
    }

    try {
      const category = await Category.create({ name });
      res.status(201).json({ message: "Category added successfully", category, success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to add category", details: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const categories = await Category.find();
      res.status(200).json({ categories, success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
