export function SiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-mn-navy-deep text-white">
            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 sm:px-8 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-slate-400">
                        © {currentYear} Meri Nazmein. All rights reserved.
                    </p>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                        Shayari • Soch • Zindagi
                    </p>
                </div>
            </div>
        </footer>
    );
}