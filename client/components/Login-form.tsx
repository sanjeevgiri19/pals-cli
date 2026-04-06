"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/**
 * Render a login form that provides a GitHub social sign-in action.
 *
 * The UI includes a logo, heading, subtitle, and a full-width "Continue With GitHub" button;
 * clicking the button initiates a GitHub social sign-in via `authClient` using the callback URL `http://localhost:3000`.
 *
 * @returns The login form as a JSX element
 */
export function LoginForm() {
  const router = useRouter();
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
    <div className="flex flex-col gap-6 justify-center items-center ">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Image src={"/goodLogo.svg"} alt="Login" height={200} width={200} />
        <h1 className="text-6xl font-extrabold text-indigo-400">
          Welcome Back! to Orbital Cli
        </h1>
        <p className="text-base font-medium text-zinc-400">
          Login to your account for allowing device flow
        </p>
      </div>
      <Card className="border-dashed border-2">
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant={"outline"}
                className="w-full h-full"
                type="button"
                onClick={() =>
                  authClient.signIn.social({
                    provider: "github",
                    callbackURL: "https://pals-cli.vercel.app", //this is required, if not then app tries to redirect to localhost:3000 and shows error
                  })
                }
              >
                <Image
                  src={"/file.svg"}
                  alt="Github"
                  height={16}
                  width={16}
                  className="size-4 dark:invert"
                />
                Continue With GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
