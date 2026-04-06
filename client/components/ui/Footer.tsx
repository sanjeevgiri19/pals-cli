import Link from "next/link";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black py-12 px-6 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <Terminal size={22} className="text-[var(--pal-primary)]" />
          <span className="text-lg font-bold tracking-tight text-white">Pals-CLI</span>
        </div>

        {/* Build info */}
        <div className="text-[var(--pal-muted)] text-sm font-mono uppercase tracking-widest">
          v1.2.0 &bull; Build with precision
        </div>

        {/* Links */}
        <div className="flex gap-6">
          {[
            { label: "Twitter", href: "#" },
            { label: "GitHub",  href: "#" },
            { label: "Discord", href: "#" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[var(--pal-muted)] hover:text-[var(--pal-primary)]
                         transition-colors duration-200 text-sm no-underline"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
