import { ArrowRight, GitBranchPlus, Link } from "lucide-react";

export const CTASection = () => {
  return (
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
                <GitBranchPlus size={20} />
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
  );
};