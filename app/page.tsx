"use client"
import React, { useEffect } from "react";
import PoemDisplay from "./components/PoemDisplay/PoemDisplay";
import "./home.scss"

interface Poem {
  _id: string;
  poemTitle: string;
  content: string;
  user_id: {
    fullName: string;
    penName: string;
  };
  category_id: {
    name: string;
  };
}

const Home: React.FC = () => {
  const [poems, setPoems] = React.useState<Poem[]>([]);

  useEffect(() => {
    document.title = "Meri Nazmein | Home";

    const fetchData = async () => {
      try {
        const response = await fetch("/api/getPoeam");
        const data = await response.json();
        if (data.success) {
          // Handle successful poem fetch
          console.log("Fetched poems:", data.poems);
          setPoems(data.poems);
        }
      } catch (error) {
        console.error("Error fetching poems:", error);
      }
    };

    fetchData();

  }, []);
  return (
    <div className="container mt-2">
      <h1>Welcome to the Home Page</h1>

      <div className="poem-list">
        {poems.map((poem) => (
          <PoemDisplay
            id={poem._id}
            key={poem._id}
            title={poem.poemTitle}
            content={poem.content}
            author={poem.user_id.fullName}
            penName={poem.user_id.penName}
            category={poem.category_id.name}
          />
        ))}
      </div>

    </div>
  );
}

export default Home;