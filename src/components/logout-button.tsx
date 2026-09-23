"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        if (loading) {
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signOut({
            scope: "local",
        });

        if (error) {
            setLoading(false);
            return;
        }

        router.replace("/");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-full border border-mn-border px-5 py-2.5 text-sm font-semibold text-mn-navy transition-all hover:border-mn-gold hover:bg-mn-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? "Signing out..." : "Logout"}
        </button>
    );
}