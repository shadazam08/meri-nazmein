"use client";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar/NavBar";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname() ?? "";
    const noNavBarPaths = ["/login", "/signup"];
    const showNavBar = !noNavBarPaths.includes(pathname);

    return (
        <>
            {showNavBar && <NavBar />}
            {children}
        </>
    );
}
