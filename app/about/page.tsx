// "use client"

// import React, { useEffect } from "react";

// const AboutPage: React.FC = () => {
//   useEffect(() => {
//     document.title = "Meri Nazmein | About";
//   }, []);
//   return (
//     <div className="container mt-2">
//       <h1>About Us</h1>
//       <p>This is the about page of our application.</p>
//     </div>
//   );
// };

// export default AboutPage;



"use client"

import React, { useEffect } from "react";

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = "Meri Nazmein | About";
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        // backgroundImage: "url('/logo-transparent-png.png')",
        backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/logo-transparent-png.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "2rem",
      }}
    >
      <div
        className="card shadow-lg p-5 text-white"
        style={{
          maxWidth: "800px",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // semi-transparent overlay for readability
        }}
      >
        <h1 className="mb-4 text-center">About Meri Nazmein</h1>

        <p className="lead">
          <strong>Meri Nazmein</strong> ek digital platform hai jahan shayari aur poetry lovers apni creativity ko explore kar sakte hain. Yahan har shayar apni <strong>nazm, ghazal, ya koi bhi kavita</strong> upload kar sakta hai aur duniya bhar ke poems padh sakta hai.
        </p>

        <p>
          Hamari koshish hai ki har user apni poetry ko ek <strong>safe aur simple platform</strong> par showcase kar sake. Abhi aap <strong>apni nazm upload kar sakte hain aur doosron ki nazmein padh sakte hain</strong>.
        </p>

        <p>
          Future me, hum is platform ko aur bhi interactive aur engaging banayenge jahan users <em>apni shayari share, comment, aur connect</em> kar paayenge. Lekin filhaal, <strong>Meri Nazmein</strong> ek simple aur focused space hai sirf poetry ko enjoy aur explore karne ke liye.
        </p>

        <p className="fst-italic text-center mt-4">
          Aayiye, apni shayari ke zariye apne jazbaat yahan record karein aur apni creativity ko celebrate karein!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
