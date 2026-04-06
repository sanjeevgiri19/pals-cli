"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Terminal, Home, MessageSquare, FileText, Settings } from "lucide-react";

export function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { data } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/sign-in") },
    });
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/docs", label: "Docs" },
    { href: "/settings", label: "Settings" },
  ];

  const mobileNavLinks = [
    { href: "/", label: "Home", Icon: Home },
    { href: "/chat", label: "Chat", Icon: MessageSquare },
    { href: "/docs", label: "Docs", Icon: FileText },
    { href: "/settings", label: "Settings", Icon: Settings },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50
                   bg-[rgba(14,14,14,0.8)] backdrop-blur-[20px]
                   shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                   border-b border-white/[0.04]"
      >
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Terminal size={20} className="text-[var(--pal-primary)]" />
            <span className="text-[1.125rem] font-extrabold tracking-[-0.03em] text-white">
              Pals-CLI
            </span>
            <p className="hidden lg:block font-mono text-[0.625rem] uppercase tracking-[0.18em]
                          text-[var(--pal-muted)] border-l border-white/10 ml-3 pl-3">
              AI-Powered Intelligence for Your Terminal.
            </p>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-sans text-[0.9rem] tracking-[-0.01em] no-underline
                            transition-colors duration-200
                            ${path === href
                              ? "text-[var(--pal-primary)]"
                              : "text-[var(--pal-muted)] hover:text-[var(--pal-primary)]"
                            }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2
                         px-5 py-2 rounded-full font-bold text-sm
                         bg-gradient-to-br from-[var(--pal-primary)] to-[var(--pal-primary-dim)]
                         text-[var(--pal-primary-on)] no-underline whitespace-nowrap
                         transition-all duration-300
                         hover:shadow-[0_0_30px_rgba(182,160,255,0.4)]
                         active:scale-95"
            >
              Get Started
            </Link>

            {/* User avatar */}
            {data?.user && (
              <div ref={ref} className="relative">
                <button
                  id="profile-menu-button"
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 rounded-full border border-white/10 overflow-hidden
                             transition-colors duration-200
                             hover:border-[rgba(182,160,255,0.5)]"
                >
                  <Image
                    src={data.user.image || "/vercel.svg"}
                    alt="profile"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-64 z-50
                                  bg-[var(--pal-surface-mid)] rounded-xl
                                  border border-white/[0.07] overflow-hidden p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={data.user.image || "/vercel.svg"}
                        alt="profile"
                        width={48}
                        height={48}
                        className="rounded-full border border-white/10"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">
                          {data.user.name || "User"}
                        </p>
                        <p className="text-xs text-[var(--pal-muted)] truncate">
                          {data.user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-sm bg-red-500/10 hover:bg-red-500/20
                                 text-red-400 border border-red-500/20
                                 py-2 rounded-full transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <footer
        className="md:hidden fixed bottom-0 left-0 right-0 z-50
                   bg-[rgba(14,14,14,0.92)] backdrop-blur-[16px]
                   border-t border-white/[0.08] rounded-t-2xl"
      >
        <div className="flex justify-around items-center h-16 px-4">
          {mobileNavLinks.map(({ href, label, Icon }) => {
            const isActive = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5
                            px-3 py-1 rounded-xl no-underline
                            font-mono text-[0.5rem] uppercase tracking-[0.1em]
                            transition-colors duration-200
                            ${isActive
                              ? "text-[var(--pal-primary)] bg-[rgba(182,160,255,0.08)]"
                              : "text-[var(--pal-muted)] hover:bg-white/[0.04]"
                            }`}
              >
                <Icon size={22} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </footer>
    </>
  );
}
