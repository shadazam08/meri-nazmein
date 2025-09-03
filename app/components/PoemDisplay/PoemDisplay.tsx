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
  const previewLines = lines.slice(0, 2);

  return (
    <div className="poem-item">
      <h2 className="poem-title">{title}</h2>

      <div className="poem-content">
        {/* {previewLines.map((line, index) => (
          <p key={index} className="poem-line">
            {line}
          </p>
        ))}
        {lines.length > 2 && (
          <Link href={`/poem/${id}`} className="show-more-btn">
            ...more
          </Link>
        )} */}
        {previewLines.map((line, index) => {
          // last preview line hai aur aur bhi lines hain -> "more" attach karna hai
          if (index === previewLines.length - 1 && lines.length > 2) {
            return (
              <p key={index} className="poem-line">
                {line}{" "}
                <Link href={`/poem/${id}`} className="show-more-btn">
                  ...more
                </Link>
              </p>
            );
          }
          return (
            <p key={index} className="poem-line">
              {line}
            </p>
          );
        })}
      </div>

      <div className="poem-footer">
        <p className="poem-meta">
          <span className="author">✍️ {author}</span>{" "}
          <span className="pen-name">({penName})</span>
        </p>
        <p className="poem-category">📂 {category}</p>

      </div>
    </div>
  );
};

export default PoemDisplay;
