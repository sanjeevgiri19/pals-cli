"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function DeviceApprovalContent() {
  const { data, isPending } = authClient.useSession();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const userCode = searchParams.get("user_code");
  const [isProcessing, setIsProcessing] = useState({
    approve: false,
    deny: false,
  });

  useEffect(() => {
    if (!isPending && !data?.session && !data?.user) {
      router.push("/sign-in");
    }
  }, [data, isPending, router]);

  if (!data?.session && !data?.user) {
    return null;
  }

  const handleApprove = async () => {
    setIsProcessing({ approve: true, deny: false });
    try {
      toast.loading("Approving device...", { id: "loading" });
      await authClient.device.approve({ userCode: userCode! });
      toast.dismiss("loading");
      toast.success("Device approved successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to approve device");
      console.log("err", error);
    }
    setIsProcessing({ approve: false, deny: false });
  };

  const handleDeny = async () => {
    setIsProcessing({ approve: false, deny: true });
    try {
      toast.loading("Denying device...", { id: "deny" });
      await authClient.device.deny({ userCode: userCode! });
      toast.dismiss("deny");
      toast.success("Oops! Device denied to approve!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to deny device");
      console.log("err", error);
    }
    setIsProcessing({ approve: false, deny: false });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0e0e0e]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-[#0e0e0e] text-white font-sans flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header Card */}
        <div className="bg-[#131313] border border-white/5 p-8 rounded-2xl transition-all hover:bg-[#1a1919] hover:border-[#b6a0ff]/20 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl border border-white/10 bg-[#1a1919] flex items-center justify-center">
                <Smartphone className="w-12 h-12 text-[var(--pal-primary)]" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#b6a0ff] rounded-full border-2 border-[#0e0e0e] flex items-center justify-center">
                <span className="text-xs text-black font-bold">!</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">
              Device Authorization
            </h1>
            <p className="text-[#adaaaa] text-sm">
              A new device is requesting access to your account
            </p>
          </div>
        </div>

        {/* Device Code Card */}
        <div className="bg-[#131313] border border-white/5 p-6 rounded-2xl transition-all hover:bg-[#1a1919] hover:border-[#b6a0ff]/20 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wide">
              Authorization Code
            </p>
            <div className="bg-[#1a1919] rounded-lg p-4 border border-white/5">
              <p className="text-xl font-mono font-bold text-[var(--pal-primary)] text-center tracking-widest">
                {userCode || "---"}
              </p>
            </div>
            <p className="text-xs text-[#adaaaa] text-center">
              Share this code with the requesting device
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 w-full flex gap-6">
          <Button
            onClick={handleApprove}
            disabled={isProcessing.approve}
            className="w-[50%] h-11 bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-black font-bold rounded-[10px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(182,160,255,0.4)] flex items-center justify-center gap-2"
          >
            {isProcessing.approve ? (
              <>
                <Spinner className="w-4 h-4" />
                <span>Approving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Approve Device</span>
              </>
            )}
          </Button>
          <Button
            onClick={handleDeny}
            disabled={isProcessing.deny}
            className="w-[45%] h-11 bg-[#262626] text-[var(--pal-primary)] border border-white/10 rounded-[10px] transition-all duration-200 hover:bg-[#2c2c2c] flex items-center justify-center gap-2"
          >
            {isProcessing.deny ? (
              <>
                <Spinner className="w-4 h-4" />
                <span>Denying...</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                <span>Deny Device</span>
              </>
            )}
          </Button>
        </div>

        {/* Security Info Card */}
        {/* <div className="bg-[#131313] border border-white/5 p-6 rounded-2xl transition-all hover:bg-[#1a1919] hover:border-[#b6a0ff]/20">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#adaaaa] uppercase tracking-wide">
              Account: {data?.user?.email}
            </p>
            <div className="bg-[#1a1919] rounded-lg p-4 border border-white/5">
              <p className="text-sm text-[#adaaaa]">
                Only approve this request if you initiated it. For security,
                never share this code with others.
              </p>
            </div>
          </div>
        </div> */}

        {/* <div className="flex items-center gap-3">
          <div className="flex-1 h-px border-t border-white/5"></div>
          <span className="text-xs text-[#adaaaa]">Choose wisely</span>
          <div className="flex-1 h-px border-t border-white/5"></div>
        </div> */}
      </div>
    </div>
  );
}
