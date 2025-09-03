"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Poem {
    id: string;
    category_id: {
        name: string;
    };
    user_id: {
        firstName: string;
        lastName: string;
        penName: string;
        email: string;
    };
    content: string;
    poemTitle: string;
}

const PoemPage: React.FC = () => {
    const params = useParams();
    const id = params?.id as string;


    const [poem, setPoem] = useState<Poem | null>(null);

    useEffect(() => {

        if (!id) return;
        const fetchPoem = async () => {
            const response = await fetch(`/api/poems/${id}`);
            const data = await response.json();
            setPoem(data.poem);
        };
        fetchPoem();
        document.title = `${poem?.poemTitle} | Poem`;
    }, [id, poem?.poemTitle]);

    if (!poem) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "700px" }}>
                {/* Title */}
                    <h1 className="text-center mb-4">{poem.poemTitle}</h1>

                {/* Poem Content */}
                <div className="mb-4">
                    {poem.content.split("\n").map((line, index) => (
                        <p key={index} className="fst-italic mb-1">
                            {line}
                        </p>
                    ))}
                </div>

                {/* Author & Category */}
                <div className="border-top pt-3 text-muted small">
                    <p className="mb-1">
                        ✍️ <strong>{poem.user_id.firstName} {poem.user_id.lastName}</strong>{" "}
                        <span className="text-secondary">({poem.user_id.penName})</span>
                    </p>
                    <p>📂 {poem.category_id.name}</p>
                </div>
            </div>
        </div>
    );
};

export default PoemPage;
