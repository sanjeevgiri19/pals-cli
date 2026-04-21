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
} from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { CTASection } from "@/components/CTASection";
import { RightTerminal } from "@/components/landingPage/RightTerminal";

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

  // if (isPending) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-[#0e0e0e]">
  //       <Spinner />
  //     </div>
  //   );
  // }

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
                v1.5.0 stable release
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
                  Used by 1,000+ developers
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest">
                  Join the alpha cohort
                </span>
              </div>
            </div>
          </div>

          {/* Right Terminal Preview */}
        <RightTerminal />
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
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
