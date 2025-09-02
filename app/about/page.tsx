"use client"

import React, { useEffect } from "react";

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = "Meri Nazmein | About";
  }, []);
  return (
    <div className="container mt-2">
      <h1>About Us</h1>
      <p>This is the about page of our application.</p>
    </div>
  );
};

export default AboutPage;
