"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { usePathname } from "next/navigation";
import Image from "next/image";
import "./NavBar.scss";

const NavBar: React.FC = () => {
    const { isLogin, logout } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    const isActive = (path: string) => pathname === path ? "active" : "";

    return (
        <nav className="navbar navbar-expand-lg slim-navbar shadow-sm">
            <div className="container-fluid">
                {/* Logo */}
                <Link className="navbar-brand d-flex align-items-center" href="/">
                    <Image src="/meri-nazmein-log.svg" alt="Logo" width={120} height={60} className="img-fluid" />
                </Link>

                {/* Mobile Toggle */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu Items */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/")}`} href="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/about")}`} href="/about">
                                About
                            </Link>
                        </li>
                        {isLogin && (
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive("/upload")}`} href="/upload">
                                    Upload
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* Right Side Buttons */}
                    <div className="d-flex align-items-center">
                        {!isLogin ? (
                            <>
                                <Link className="btn btn-outline-primary me-2 btn-sm" href="/login">Login / Sign Up</Link>
                                {/* <Link className="btn btn-outline-primary btn-sm" href="/signup">Sign Up</Link> */}
                            </>
                        ) : (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
