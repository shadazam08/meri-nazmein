/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectDB } from "../../lib/mongodb";
import UserAccount from "../../models/UserAccount";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  await connectDB();
  if (req.method === "POST") {


    const requiredFields = ["email", "password"];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    const { email, password } = req.body;

    try {
      const user = await UserAccount.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      const { password: _, ...userData } = user.toObject();

      res.status(200).json({ message: "Login successful", token, user: userData, success: true });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

export default handler;
