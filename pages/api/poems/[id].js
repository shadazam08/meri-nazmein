import { connectDB } from "../../../lib/mongodb";
import Poem from "../../../models/Poem";

export default async function handler(req, res) {
  await connectDB();
  const {
    query: { id },
  } = req;

  console.log("id..............", id);

  try {
    const poem = await Poem.findOne({ _id: id })
      .populate("user_id", "firstName lastName penName email")
      .populate("category_id", "name");
    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }
    console.log("poem............", poem);

    res.status(200).json({ poem });
  } catch (error) {
    console.error("Error fetching poem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  //   else {
  //     res.setHeader("Allow", ["GET"]);
  //     res.status(405).end(`Method ${req.method} Not Allowed`);

  //   }
}
