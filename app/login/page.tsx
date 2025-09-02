"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import "./login.scss";

// Input Component
interface InputProps {
    id: string;
    type: string;
    label: string;
    name: string;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ id, type, label, disabled, name }) => (
    <input
        className="form-group__input"
        type={type}
        id={id}
        placeholder={label}
        disabled={disabled}
        name={name}
    />
);

// LoginForm Component
interface LoginFormProps {
    mode: "login" | "signup";
    onSubmit: (e: React.FormEvent<HTMLFormElement>, mode: "login" | "signup") => void;

}

const LoginForm: React.FC<LoginFormProps> = ({ mode, onSubmit }) => {
    return (
        <>
            <form onSubmit={(e) => onSubmit(e, mode)}>
                <div className="form-block__input-wrapper">
                    {/* Login Fields */}

                    <div className="form-group form-group--login">
                        <Input type="email" id="loginEmail" label="Email" name="email" disabled={mode === "signup"} />
                        <Input type="password" id="password" label="Password" name="password" disabled={mode === "signup"} />
                    </div>

                    {/* Signup Fields */}
                    <div className="form-group form-group--signup">
                        <Input type="text" id="firstName" label="First Name" name="firstName" disabled={mode === "login"} />
                        <Input type="text" id="lastName" label="Last Name" name="lastName" disabled={mode === "login"} />
                        <Input type="text" id="penName" label="Pen Name" name="penName" disabled={mode === "login"} />
                        <Input type="email" id="email" label="Email" name="email" disabled={mode === "login"} />
                        <Input type="password" id="createpassword" label="password" name="createpassword" disabled={mode === "login"} />
                        <Input type="password" id="repeatpassword" label="repeat password" name="repeatpassword" disabled={mode === "login"} />
                    </div>
                </div>

                <button className="button button--primary full-width" type="submit">
                    {mode === "login" ? "Log In" : "Sign Up"}
                </button>
            </form>
        </>
    );
};

// LoginComponent
interface LoginComponentProps {
    initialMode: "login" | "signup";
    onSubmit: (e: React.FormEvent<HTMLFormElement>, initialMode: "login" | "signup") => void;

}

const LoginComponent: React.FC<LoginComponentProps> = ({ initialMode, onSubmit }) => {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);

    const toggleMode = () => {
        setMode((prev) => (prev === "login" ? "signup" : "login"));
    };

    return (
        <div>
            <div className={`form-block-wrapper form-block-wrapper--is-${mode}`}></div>
            <section className={`form-block form-block--is-${mode}`}>
                <header className="form-block__header">
                    <h1>{mode === "login" ? "Welcome back!" : "Sign up"}</h1>
                    <div className="form-block__toggle-block">
                        <span>
                            {mode === "login" ? "Don't" : "Already"} have an account? Click
                            here &rarr;
                        </span>
                        <input id="form-toggler" type="checkbox" onClick={toggleMode} checked={mode === "signup"} readOnly />
                        <label htmlFor="form-toggler"></label>
                    </div>
                </header>
                <LoginForm mode={mode} onSubmit={onSubmit} />
            </section>
        </div>
    );
};

// ✅ Next.js Page
const LoginPage: React.FC = () => {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const { isLogin, setLogin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLogin) {
            router.push("/");
        }

    }, [isLogin, router]);
    useEffect(() => {
        document.title = "Login | Sign Up";
      }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: "login" | "signup") => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            if (mode === "login") {
                const payload = {
                    email: formData.get("email") as string,
                    password: formData.get("password") as string,
                };
                const res = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })

                const data = await res.json();
                if (data.success) {
                    console.log("Login successful:", data.user.user_id);
                    const userId = data?.user?.user_id;
                    const userEmail = data?.user?.email;
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user_id", userId);
                    localStorage.setItem("user_email", userEmail);
                    setLogin(true);
                    router.push("/");
                } else {
                    if (data.message === "Invalid email") {
                        toast.error(data.message || "Login failed");
                    } else if (data.message === "Invalid password") {
                        toast.error(data.message || "Login failed");
                    } else {
                        toast.error(data.message || "Login failed");
                    }
                }
            } else if (mode === "signup") {
                const createPassword = formData.get("createpassword") as string;
                const repeatPassword = formData.get("repeatpassword") as string;
                if (createPassword !== repeatPassword) {
                    toast.error("Passwords do not match");
                    return;
                } else {
                    const payload = {
                        firstName: formData.get("firstName") as string,
                        lastName: formData.get("lastName") as string,
                        penName: formData.get("penName") as string,
                        email: formData.get("email") as string,
                        password: createPassword,
                    };

                    const res = await fetch("/api/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });

                    const data = await res.json();
                    if (data.success) {
                        setMode("login");
                        toast.success(data.message);
                        form.reset();
                        // localStorage.setItem("token", data.token);
                    } else {
                        toast.error(data.message || "Signup failed");
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error:", error);
        }
    };

    return (
        <div className="app app--is-login">
            <LoginComponent key={mode} initialMode={mode} onSubmit={handleSubmit} />
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default LoginPage;
