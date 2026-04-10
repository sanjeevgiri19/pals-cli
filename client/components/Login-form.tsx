"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const callbackURL = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  // const [isLoading, setIsLoading] = useState(false)

  // const onLogin = async () => {
  //   setIsLoading(true);
  //   await authClient.signIn.social({
  //     provider: "github",
  //     callbackURL: "http://localhost:3000",
  //   });
  //   setIsLoading(false);
  // };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-[clamp(2.75rem,7vw,3.5rem)] px-2 font-black tracking-tighter leading-[0.92]">
            Welcome to{" "}
            <span className="bg-gradient-to-br mt-2 from-[#b6a0ff] via-[#a98fff] to-[#bc8df9] bg-clip-text text-transparent">
              Pals-CLI
            </span>
          </h1>
          <p className="text-[#adaaaa] text-lg">
            Secure authentication for your terminal companion
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#131313] border border-white/5 p-8 rounded-2xl transition-all hover:bg-[#1a1919] hover:border-[#b6a0ff]/20">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-[#adaaaa] text-sm">
                Connect your GitHub account to get started
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-br from-[#b6a0ff] to-[#7e51ff] text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(182,160,255,0.4)] transition-all duration-300"
              type="button"
              onClick={() =>
                authClient.signIn.social({
                  provider: "github",
                  callbackURL,
                })
              }
            >
              {/* <Image
                src={"/vercel.svg"}
                alt="Github"
                height={20}
                width={20}
                className="mr-2"
              /> */}
              Continue with GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
