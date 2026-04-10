"use client";
import { authClient } from "@/lib/auth-client";
import type React from "react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";

export default function DeviceAuthorizationPage() {
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formattedCode = userCode.trim().replace(/-/g, "").toUpperCase();

      const response = await authClient.device({
        query: { user_code: formattedCode },
      });

      if (response.data) {
        router.push(`/approve?user_code=${formattedCode}`);
      }
    } catch (err) {
      setError("Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4, 8);
    }
    setUserCode(value);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-3 rounded-lg border border-white/10 bg-[#131313]">
            <ShieldAlert className="w-8 h-8 text-[var(--pal-primary)]" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Device Authorization
            </h1>
            <p className="text-[#adaaaa]">Enter your device code to continue</p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#131313] border border-white/5 rounded-xl p-8 transition-all hover:bg-[#1a1919] hover:border-[#b6a0ff]/20"
        >
          <div className="space-y-6">
            {/* Code Input */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-white mb-2"
              >
                Device Code
              </label>
              <input
                id="code"
                type="text"
                value={userCode}
                onChange={handleCodeChange}
                placeholder="XXXX-XXXX"
                maxLength={9}
                className="w-full px-4 py-3 bg-[#1a1919] border border-white/5 rounded-lg text-white placeholder-[#adaaaa] focus:outline-none focus:border-[#b6a0ff]/50 font-mono text-center text-lg tracking-widest transition-colors"
              />
              <p className="text-xs text-[#adaaaa] mt-2">
                Find this code on the device you want to authorize
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-900/50 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || userCode.length < 9}
              className="w-full py-3 px-4 bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(182,160,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>

            {/* Info Box */}
            <div className="p-4 bg-[#1a1919] border border-white/5 rounded-lg">
              <p className="text-xs text-[#adaaaa] leading-relaxed">
                This code is unique to your device and will expire shortly. Keep
                it confidential and never share it with anyone.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
