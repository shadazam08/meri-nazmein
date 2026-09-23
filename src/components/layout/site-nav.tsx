"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Nazmein", href: "/nazmein" },
    { name: "Ghazals", href: "/ghazals" },
    { name: "Shayari", href: "/shayari" },
    { name: "Authors", href: "/authors" },
];

function isActivePath(pathname: string, href: string) {
    if (href === "/") {
        return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 lg:flex"
        >
            {navigation.map((item) => {
                const isActive = isActivePath(
                    pathname,
                    item.href,
                );

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={
                            isActive ? "page" : undefined
                        }
                        className={`relative py-2 text-sm font-semibold transition-colors ${isActive
                                ? "text-mn-navy"
                                : "text-mn-text hover:text-mn-blue"
                            }`}
                    >
                        {item.name}

                        {isActive && (
                            <span
                                aria-hidden="true"
                                className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-mn-gold"
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}