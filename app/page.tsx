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
  const [isLoading, setIsLoading] = React.useState<boolean>(true); // loading state

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, []);
  return (
    <div style={{
      backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/logo-transparent-png.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "2rem",
    }}>
      {/* <h1>Welcome to the Home Page</h1> */}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : poems.length === 0 ? (
        <p>No poems available.</p> // agar koi poem na mile
      ) : (
        <div className="poem-lists">
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
      )}
    </div>
  );
}

export default Home;