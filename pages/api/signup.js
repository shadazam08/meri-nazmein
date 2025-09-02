/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectDB } from "../../lib/mongodb";
import UserAccount from "./../../models/UserAccount";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  await connectDB();
  if (req.method === "POST") {
    const requreFeild = ["firstName", "lastName", "email", "penName", "password"];

    console.log("req.................", req.body);

    const missingFields = requreFeild.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    const { firstName, lastName, email, password, penName } = req.body;
    try {
      const existingUser = await UserAccount.findOne({ email });
      const existingPenName = await UserAccount.findOne({ penName });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      if (existingPenName) {
        return res.status(409).json({ message: "Pen name already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserAccount.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        penName,
      });
      const { password: _, ...userData } = newUser.toObject();
      return res.status(201).json({ message: "User created successfully", user: userData, success: true });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

export default handler;
