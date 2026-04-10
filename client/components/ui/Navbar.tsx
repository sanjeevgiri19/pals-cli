"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Terminal, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };
  if (path === "/chat") return null;

  const navLinks = [
    { href: "/", label: "Home" },
    ...(data?.user ? [{ href: "/chat", label: "Chat" }] : []),
    { href: "/docs", label: "Docs" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50
      border-b bg-background/80 backdrop-blur "
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">Pals-CLI</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                path === href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!data?.user && (
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Link>
            )}

            {data?.user && (
              <div ref={ref} className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="h-9 w-9 overflow-hidden rounded-full border"
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
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-popover p-4 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={data.user.image || "/vercel.svg"}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">
                          {data.user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {data.user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-sm text-red-500 hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger >
                <button className="p-2 rounded-md border">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72 p-6">
                <div className="flex flex-col gap-6 mt-6">
                  {/* Nav Links */}
                  <nav className="flex flex-col gap-4">
                    {navLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`text-sm font-medium ${
                          path === href
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>

                  {/* Auth Section */}
                  <div className="border-t pt-4">
                    {!data?.user ? (
                      <Link href="/sign-in" className="text-sm font-medium">
                        Sign In
                      </Link>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={data.user.image || "/vercel.svg"}
                            alt="profile"
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {data.user.name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {data.user.email}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="text-sm text-red-500 text-left"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
