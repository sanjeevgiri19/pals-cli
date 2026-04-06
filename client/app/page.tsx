"use client";

import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Render the landing page UI and redirect unauthenticated users to the sign-in page.
 *
 * Renders a centered loading spinner while session state is pending. If no session or user is present, triggers a client-side navigation to "/sign-in". Otherwise renders the public homepage with hero content and navigation links.
 *
 * @returns The React element for the homepage.
 */
export default function HomePage() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!data?.session && !data?.user) {
    router.push("/sign-in");
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <section className="text-center py-24">
        <h1 className="text-4xl font-bold mb-4">
          PAL CLI — AI Assistant for Devs
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Chat with AI, run developer tools, or use the CLI to integrate PAL
          into your workflows. Start a conversation or explore the docs.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/chat"
            className="px-6 py-3 bg-blue-600 text-white rounded-md"
          >
            Launch Chat
          </Link>
          <Link href="/about" className="px-6 py-3 border rounded-md">
            Learn More
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Chat</h3>
          <p className="text-sm text-gray-500">
            Ask questions, get code snippets, and iterate with the assistant.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">CLI</h3>
          <p className="text-sm text-gray-500">
            Use `palscli` to run commands locally and integrate AI into
            pipelines.
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Integrations</h3>
          <p className="text-sm text-gray-500">
            Connect to tools like Google, GitHub, and more via plugins.
          </p>
        </div>
      </section>
    </div>
  );
}
