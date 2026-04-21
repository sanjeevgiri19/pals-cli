"use client";

import { useState } from "react";
import { Terminal, Download, KeyRound, Rocket, CheckCircle2, Zap, Copy, Check } from "lucide-react";
import { Footer } from "@/components/ui/Footer";

type PackageManager = "npm" | "yarn" | "pnpm";

const packageManagers: { id: PackageManager; label: string; command: string }[] = [
  { id: "npm", label: "npm", command: "npm i -g palscli" },
  { id: "yarn", label: "yarn", command: "yarn global add palscli" },
  { id: "pnpm", label: "pnpm", command: "pnpm add -g palscli" },
];

const steps = [
  {
    num: "01",
    icon: <Download size={20} />,
    title: "Install",
    body: "Pull the core binary to your local environment. Pals-CLI is lightweight and built for high-concurrency workflows.",
    badge: { color: "bg-[var(--pal-primary)]", label: "Ready to execute", textColor: "text-[var(--pal-primary)]" },
  },
  {
    num: "02",
    icon: <KeyRound size={20} />,
    title: "Authenticate",
    body: "Link your secure API keys via the CLI. We use hardware-level encryption to keep your tokens local and safe.",
    badge: { color: "bg-[#b688f3]", label: "Encryption active", textColor: "text-[#b688f3]" },
  },
  {
    num: "03",
    icon: <Rocket size={20} />,
    title: "Build",
    body: (
      <>
        Initialize your first session with{" "}
        <code className="bg-black/40 px-2 py-0.5 rounded text-[var(--pal-primary)]">
          palscli chat
        </code>{" "}
        and watch the monolith come alive.
      </>
    ),
    badge: { color: "bg-[var(--pal-secondary)]", label: "System initialized", textColor: "text-[var(--pal-secondary)]" },
  },
];

const badges = [
  { label: "Zero Config" },
  { label: "AES-256"    },
  { label: "Edge First"  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full md:w-auto flex items-center justify-center gap-3
                 bg-[var(--pal-surface-highest)] hover:bg-[var(--pal-surface-bright)]
                 text-[var(--pal-primary)] px-8 py-4 rounded-xl
                 transition-all duration-200 active:scale-95"
    >
      <span className="font-mono text-sm uppercase tracking-widest">
        {copied ? "Copied!" : "Copy Command"}
      </span>
      {copied ? <Check size={18} /> : <Copy size={18} />}
    </button>
  );
}

export default function DocsPage() {
  const [selectedPM, setSelectedPM] = useState<PackageManager>("npm");
  const selectedCommand = packageManagers.find((pm) => pm.id === selectedPM)?.command || "";

  return (
    <div className="bg-[var(--pal-bg)] text-[var(--pal-on-surface)] min-h-screen">
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

        {/* Hero Section */}
        <section className="mb-24 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                Quick{" "}
                <span className="text-[var(--pal-primary)]">Start</span>
              </h1>
              <p className="text-[var(--pal-primary)] font-mono text-sm uppercase tracking-[0.3em] mb-4">
                AI-Powered Intelligence for Your Terminal
              </p>
              <p className="text-[var(--pal-muted)] text-xl leading-relaxed max-w-xl">
                Deploy your autonomous developer environment in seconds. No
                configuration hell, just pure execution.
              </p>
            </div>

            {/* Animated bolt icon — desktop only */}
            <div className="hidden lg:flex items-center justify-center
                            w-24 h-24 rounded-full border-2 border-[rgba(182,160,255,0.2)]
                            animate-pulse">
              <div className="w-16 h-16 rounded-full bg-[rgba(182,160,255,0.1)]
                              flex items-center justify-center">
                <Zap size={36} className="text-[var(--pal-primary)] fill-[var(--pal-primary)]" />
              </div>
            </div>
          </div>
        </section>

        {/* Install command strip */}
        <section className="mb-24">
          {/* Package Manager Tabs */}
          <div className="flex gap-2 mb-4">
            {packageManagers.map((pm) => (
              <button
                key={pm.id}
                onClick={() => setSelectedPM(pm.id)}
                className={`px-4 py-2 rounded-lg font-mono text-sm font-semibold transition-all duration-200 ${
                  selectedPM === pm.id
                    ? "bg-[var(--pal-primary)] text-black"
                    : "bg-[var(--pal-surface-mid)] text-[var(--pal-muted)] hover:bg-[var(--pal-surface-highest)]"
                }`}
              >
                {pm.label}
              </button>
            ))}
          </div>

          <div className="bg-black rounded-xl p-1 overflow-hidden">
            <div className="bg-[var(--pal-surface-low)] rounded-lg p-8
                            flex flex-col md:flex-row items-center justify-between gap-6
                            relative overflow-hidden">
              {/* Glow */}
              <div
                aria-hidden
                className="absolute top-0 right-0 -mr-16 -mt-16
                           w-64 h-64 bg-[rgba(182,160,255,0.05)] rounded-full blur-3xl pointer-events-none"
              />

              <div className="flex items-center gap-6 w-full">
                <div className="hidden sm:flex items-center justify-center
                                bg-[rgba(182,160,255,0.1)] p-4 rounded-xl">
                  <Terminal size={28} className="text-[var(--pal-primary)]" />
                </div>
                <div className="flex-1">
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em]
                                    text-[var(--pal-primary)] mb-2">
                    Global Installation
                  </label>
                  <code className="font-mono text-xl md:text-3xl text-white">
                    {selectedCommand}
                  </code>
                </div>
              </div>

              <CopyButton text={selectedCommand} />
            </div>
          </div>
        </section>

        {/* Step cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ num, icon, title, body, badge }) => (
            <div
              key={num}
              className="group bg-[var(--pal-surface-low)] rounded-xl p-8 min-h-[320px]
                         flex flex-col justify-between
                         hover:bg-[var(--pal-surface-mid)]
                         transition-colors duration-500"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-5xl font-black
                                   text-[rgba(182,160,255,0.2)]
                                   group-hover:text-[rgba(182,160,255,0.4)]
                                   transition-colors duration-300">
                    {num}
                  </span>
                  <div className="bg-[var(--pal-surface-highest)] p-3 rounded-lg
                                  text-[var(--pal-primary)]">
                    {icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                <p className="text-[var(--pal-muted)] leading-relaxed">{body}</p>
              </div>

              {/* Status badge */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${badge.color}`} />
                  <span className={`text-[10px] font-mono uppercase tracking-widest opacity-60 ${badge.textColor}`}>
                    {badge.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Edge banner */}
        <section className="mt-32">
          <div className="relative overflow-hidden rounded-2xl aspect-[21/9]
                          bg-[var(--pal-surface-low)]">
            <div
              className="absolute inset-0 bg-cover bg-center grayscale opacity-40"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=80')",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[var(--pal-bg)] via-transparent to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <h2 className="text-4xl font-black tracking-tighter mb-4 text-white">
                The Developer&apos;s Edge
              </h2>
              <p className="text-[var(--pal-muted)] max-w-lg mb-8">
                Join hundreds of developers orchestrating their infrastructure through
                the pals interface.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {badges.map(({ label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full
                               bg-[rgba(91,45,148,0.3)] border border-[rgba(188,141,249,0.15)]"
                  >
                    <CheckCircle2 size={14} className="text-[var(--pal-secondary)]" />
                    <span className="font-mono text-xs uppercase tracking-widest
                                     text-[#e1c7ff]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
