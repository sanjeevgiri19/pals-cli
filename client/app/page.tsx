"use client";

import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Zap,
  MessageSquare,
  Wand2,
  Rocket,
  ArrowRight,
  // Github,
} from "lucide-react";
import { Footer } from "@/components/ui/Footer";

const features = [
  {
    id: "instant-auth",
    icon: <Zap size={28} />,
    title: "Instant Auth",
    description:
      "Zero-config login using GitHub or Google. Tokens are encrypted and stored in your local system keychain.",
  },
  {
    id: "contextual-chat",
    icon: <MessageSquare size={28} />,
    title: "Contextual Chat",
    description:
      "AI that understands your local directory. Ask questions about your code without leaving the terminal.",
  },
  {
    id: "codegen",
    icon: <Wand2 size={28} />,
    title: "Codegen Automations",
    description:
      "Generate boilerplate, tests, and documentation with one command. Built for modern frameworks.",
  },
];

const avatarColors = [
  "bg-[rgba(182,160,255,0.3)]",
  "bg-[rgba(188,141,249,0.3)]",
  "bg-[rgba(126,81,255,0.3)]",
];

function AvatarStack() {
  const initials = ["D", "E", "A"];
  return (
    <div className="flex">
      {initials.map((letter, i) => (
        <div
          key={i}
          className={`
            w-9 h-9 rounded-full border-2 border-[#0e0e0e]
            flex items-center justify-center
            text-[0.7rem] font-bold text-[var(--pal-primary)]
            ${avatarColors[i]}
            ${i > 0 ? "-ml-3" : ""}
          `}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0e0e0e]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-[#0e0e0e] text-white font-sans overflow-x-hidden min-h-screen">
      <main className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-32">
        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(182,160,255,0.08)_0%,transparent_70%)] pointer-events-none -z-10" />

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 items-center relative z-10">
          {/* Left Copy */}
          <div className="flex flex-col gap-8">
            <div className="flex">
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full
                               bg-[#262626] border border-white/5
                               font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#adaaaa]"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--pal-primary)] animate-pulse-dot" />
                v1.2.0 stable release
              </span>
            </div>

            <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] font-black tracking-tighter leading-[0.92] text-white m-0">
              Authenticate, <br />
              <span className="bg-gradient-to-br from-[#b6a0ff] via-[#a98fff] to-[#bc8df9] bg-clip-text text-transparent">
                Chat & Build
              </span>
              <br />
              with Pals-CLI.
            </h1>

            <p className="text-xl leading-relaxed text-[#adaaaa] max-w-[500px] m-0">
              The ultra-fast developer companion for your terminal. Secure
              authentication, persistent chat sessions, and automated code
              generation directly in your CLI workflow.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2
                           px-8 py-3.5 rounded-full font-bold text-lg
                           bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff]
                           text-black no-underline whitespace-nowrap
                           transition-all duration-300
                           hover:shadow-[0_0_30px_rgba(182,160,255,0.4)]
                           active:scale-95"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2
                           px-8 py-3.5 rounded-full font-bold text-lg
                           bg-[#262626] text-[var(--pal-primary)]
                           border border-white/10 no-underline whitespace-nowrap
                           transition-all duration-200
                           hover:bg-[#2c2c2c]
                           active:scale-95"
              >
                <Terminal size={20} />
                View Docs
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-6 text-sm text-[#adaaaa]">
              <AvatarStack />
              <div>
                <span className="block font-bold text-white">
                  Used by 2,000+ developers
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest">
                  Join the alpha cohort
                </span>
              </div>
            </div>
          </div>

          {/* Right Terminal Preview */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#b6a0ff]/20 to-[#bc8df9]/10 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative bg-black rounded-xl border border-white/10 overflow-hidden shadow-2xl font-mono text-sm leading-relaxed">
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a1919] border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                <span className="ml-4 text-[10px] uppercase tracking-widest text-[#adaaaa] opacity-50">
                  palscli — chat
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <span className="text-[var(--pal-primary)]">$</span>
                  <span className="text-white">
                    palscli chat &quot;Explain the auth flow&quot;
                  </span>
                </div>
                <div className="flex gap-3 items-start bg-white/5 p-4 rounded-lg border border-white/5">
                  <div className="text-[var(--pal-primary)] shrink-0 flex items-center gap-2">
                    <Rocket size={14} />
                    <span>AI:</span>
                  </div>
                  <div className="text-[#adaaaa]">
                    PALS CLI uses encrypted device flow. When you run `login`,
                    we generate a secure token saved in your local keychain.
                    <span className="inline-block w-2 h-4 bg-[var(--pal-primary)]/50 ml-2 animate-blink align-middle" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 font-sans">
          {features.map(({ id, icon, title, description }) => (
            <div
              key={id}
              className="group bg-[#131313] border border-white/5 p-8 rounded-2xl transition-all hover:bg-[#1a1919] hover:border-[#b6a0ff]/20"
            >
              <div className="text-[var(--pal-primary)] mb-6 transition-transform group-hover:scale-110">
                {icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
              <p className="text-[#adaaaa] text-sm leading-relaxed m-0">
                {description}
              </p>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-[var(--pal-primary)]/10 to-transparent blur-3xl -z-10 rounded-full" />
          <div className="bg-[#131313] border border-white/5 rounded-[40px] p-20 text-center space-y-10 overflow-hidden relative">
            <div className="flex justify-center">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-white/60">
                &bull; join 50k+ developers
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
              Ready to Accelerate <br />
              Your{" "}
              <span className="text-[var(--pal-primary)]">Development?</span>
            </h2>
            <p className="text-[#adaaaa] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Transform your terminal into a powerhouse of productivity. Start
              your high-performance journey today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link
                href="/chat"
                className="group bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-black px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 active:scale-95 transition-all shadow-[0_0_40px_rgba(182,160,255,0.3)] hover:shadow-[0_0_60px_rgba(182,160,255,0.4)]"
              >
                Get Started Now
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="https://github.com/sanjeevgiri19/palscli"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all active:scale-95 shadow-lg"
              >
                <ArrowRight size={20} />
                View on GitHub
              </Link>
            </div>
            <div className="flex justify-center gap-2 pt-8 opacity-40">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-3 h-1.5 rounded-full bg-[var(--pal-primary)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
