"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import "./upload.scss";

// Input Component
interface InputProps {
    id: string;
    type: string;
    label: string;
    name: string;
    maxLength?: number;
}
interface TextareaProps {
    id: string;
    'aria-label': string;
    name: string;
    placeholder: string;
    rows: number;
}

interface SelectProps {
    id: string;
    name: string;
    options: Array<{ value: string; label: string }>;
}

// ✅ Category Interface
interface Category {
    _id: string;
    name: string;
}

const Input: React.FC<InputProps> = ({ id, type, label, name, maxLength }) => (
    <input
        className="form-group__input"
        type={type}
        id={id}
        placeholder={label}
        name={name}
        maxLength={maxLength}
    />
);

const Textarea: React.FC<TextareaProps> = ({ id, 'aria-label': ariaLabel, name, placeholder, rows }) => (
    <textarea
        className="form-group__input"
        style={{ height: '380px' }}
        id={id}
        aria-label={ariaLabel}
        name={name}
        placeholder={placeholder}
        rows={rows}
    ></textarea>
);

const Select: React.FC<SelectProps> = ({ id, name, options }) => (
    <select className="form-group__input" id={id} name={name}>
        <option value="">Select Category</option>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

// UploadForm Component
interface UploadFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    category?: Category[] | null;
}

const UploadForm: React.FC<UploadFormProps> = ({ onSubmit, category }) => {
    return (
        <>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className="form-block__input-wrapper">
                    {/* Upload Fields */}

                    <div className="form-group form-group--upload">
                        <Input type="text" id="title" label="Title" name="title" maxLength={100} />
                        <Textarea id="content" rows={3} placeholder="Content" aria-label="Content" name="content" />
                        {category && category.length > 0 ? (
                            <Select id="category" name="category" options={category.map((cat) => ({ value: cat._id, label: cat.name }))} />
                        ) : (
                            <p>No categories available</p>
                        )}
                    </div>
                </div>
                <button className="button button--primary float-end" type="submit">
                    Submit
                </button>
            </form>
        </>
    );
};

// UploadComponent
interface UploadComponentProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    category?: Category[] | null;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onSubmit, category }) => {
    return (
        <div>
            <div className={`form-block-wrapper form-block-wrapper--is-upload`}></div>
            <section className={`form-block form-block--is-upload`}>
                <UploadForm onSubmit={onSubmit} category={category} />
            </section>
        </div>
    );
};

// ✅ Next.js Page
const UploadPage: React.FC = () => {

    const { isLogin, authLoading } = useAuth();
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [category, setCategory] = useState<Category[] | null>([]);

    useEffect(() => {
        if (authLoading) return;
        const email = localStorage.getItem("user_email");
        if (email) setUserEmail(email);
        document.title = "Meri Nazmein | Upload";
        if (!isLogin) {
            router.push("/");
        }
    }, [isLogin, router, authLoading]);

    useEffect(() => {
        const fetchCategories = async () => {
            const respo = await fetch("/api/addCategory");
            const data = await respo.json();
            if (data.success) {
                setCategory(data.categories);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const cat = formData.get("category");
        console.log("Categories.................", cat);

        const payload = {
            title: formData.get("title"),
            content: formData.get("content"),
            categoryID: formData.get("category"),
            user_email: userEmail,
        }

        // Handle form data submission
        const response = await fetch("/api/uploadPoem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data.success) {
            toast.success(data.message || "Upload successful!");
            form.reset();
        } else {
            toast.error(data.message || "Upload failed.");
        }
    };

    return (
        // <div className="container-fluid">
        <div className="app app--is-upload">
            <UploadComponent onSubmit={handleSubmit} category={category} />
            <ToastContainer position="bottom-right" autoClose={5000} />
        </div>
        // </div>
    );
};

export default UploadPage;
