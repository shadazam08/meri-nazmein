// import React from "react";
// import "./PoemDisplay.scss"

// interface PoemDisplayProps {
//   title: string;
//   content: string;
//   author: string;
//   penName: string;
//   category: string;
// }

// const PoemDisplay: React.FC<PoemDisplayProps> = ({
//   title,
//   content,
//   author,
//   penName,
//   category,
// }) => {
//   return (
//     <div className="poem-item">
//       <h2 className="poem-title">{title}</h2>
//       <div className="poem-content">
//         {content.split("\n").map((line, index) => (
//           <p key={index} className="poem-line">
//             {line}
//           </p>
//         ))}
//       </div>
//       <div className="poem-footer">
//         <p className="poem-meta">
//           ✍️ <span className="author">{author}</span>{" "}
//           <span className="pen-name">({penName})</span>
//         </p>
//         <p className="poem-category">📂 {category}</p>
//       </div>
//     </div>
//   );
// };

// export default PoemDisplay;


import React from "react";
import Link from "next/link";
import "./PoemDisplay.scss";

interface PoemDisplayProps {
  id: string; // unique id chahiye poem identify karne ke liye
  title: string;
  content: string;
  author: string;
  penName: string;
  category: string;
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({
  id,
  title,
  content,
  author,
  penName,
  category,
}) => {
  const lines = content.split("\n");
  const previewLines = lines.slice(0, 3);

  return (
    <div className="poem-item">
      <h2 className="poem-title">{title}</h2>

      <div className="poem-content">
        {previewLines.map((line, index) => (
          <p key={index} className="poem-line">
            {line}
          </p>
        ))}

        {lines.length > 3 && (
          <Link href={`/poem/${id}`} className="show-more-btn">
            ... more
          </Link>
        )}
      </div>

      <div className="poem-footer">
        <p className="poem-meta">
          ✍️ <span className="author">{author}</span>{" "}
          <span className="pen-name">({penName})</span>
        </p>
        <p className="poem-category">📂 {category}</p>
      </div>
    </div>
  );
};

export default PoemDisplay;
