"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

/**
 * Renders the top navigation bar with site links, a "Launch Chat" call-to-action, and a user-profile dropdown when an authenticated session user exists.
 *
 * The profile dropdown displays the user's image, name (falls back to "User"), and email; it closes when clicking outside the dropdown and the Logout button signs the user out and redirects to `/sign-in`.
 *
 * @returns The rendered navigation header element.
 */
export function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { data } = authClient.useSession();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      path === href
        ? "bg-gray-900 text-white"
        : "text-gray-200 hover:bg-gray-800"
    }`;

  // close dropdown on outside click
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
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold">
              PAL CLI
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link href="/" className={linkClass("/")}>
                Home
              </Link>
              <Link href="/chat" className={linkClass("/chat")}>
                Chat
              </Link>
              <Link href="/about" className={linkClass("/about")}>
                About / FAQs
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
            >
              Launch Chat
            </Link>

            {/* USER PROFILE */}
            {data?.user && (
              <div ref={ref} className="relative">
                <button onClick={() => setOpen(!open)}>
                  <Image
                    src={data.user.image || "/vercel.svg"}
                    alt="profile"
                    width={36}
                    height={36}
                    className="rounded-full border object-cover"
                  />
                </button>

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg p-4 z-50">
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={data.user.image || "/vercel.svg"}
                        alt="profile"
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">
                          {data.user.name || "User"}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {data.user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-sm bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
