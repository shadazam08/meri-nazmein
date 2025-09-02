import { connectDB } from "../../lib/mongodb";
import Poem from "../../models/Poem";
import "../../models/UserAccount";
import "../../models/Category";

const handler = async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      // const poems = await Poem.find({})
      //   .populate("user_id", "penName email") // user ka data chahiye
      //   .populate("category_id", "name"); // category ka data chahiye

      const poems = await Poem.find({})
        .populate("user_id", "firstName lastName penName email")
        .populate("category_id", "name");

      // Add fullName field manually
      const poemsWithFullName = poems.map((poem) => ({
        ...poem.toObject(),
        user_id: {
          ...poem.user_id.toObject(),
          fullName: `${poem.user_id.firstName} ${poem.user_id.lastName}`,
        },
      }));

      res.status(200).json({ success: true, poems: poemsWithFullName });
    } catch (error) {
      console.error("GetPoem error:", error);
      res.status(500).json({ success: false, message: "Error fetching poems", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
