import { Rocket } from "lucide-react"

export const RightTerminal = () => {
    return (
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
        
    )
}