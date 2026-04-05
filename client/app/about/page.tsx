/**
 * Render the About / FAQs page containing usage instructions and troubleshooting guidance.
 *
 * Includes three sections: "How to use the web chat" (step-by-step usage), "How to use the CLI" (example commands), and "Troubleshooting" (sign-in and network check advice).
 *
 * @returns A JSX element containing the About / FAQs layout
 */
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">About / FAQs</h1>

      <section className="mb-6">
        <h2 className="font-semibold">How to use the web chat</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 mt-2">
          <li>
            Open the <strong>Chat</strong> page from the navbar.
          </li>
          <li>Sign in using the provider (GitHub) if prompted.</li>
          <li>Select or create a conversation from the left sidebar.</li>
          <li>
            Type your message and press send. Assistant responses appear on the
            left.
          </li>
          <li>
            Use the <i>New Chat</i> button to start fresh conversations.
          </li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">How to use the CLI</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          The CLI exposes commands to interact with the same assistant from your
          terminal. Example usage:
        </p>
        <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-auto">
          npm install -g palcli # Start a chat palcli chat # Run AI assist on a
          file palcli ai analyze ./src/index.js
        </pre>
      </section>

      <section>
        <h2 className="font-semibold">Troubleshooting</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          If you are redirected to sign-in while authenticated, try refreshing
          the page or signing out and signing in again. If problems persist,
          open the browser console and check network requests to{" "}
          <code>/api/conversations</code> for 401 responses.
        </p>
      </section>
    </div>
  );
}
