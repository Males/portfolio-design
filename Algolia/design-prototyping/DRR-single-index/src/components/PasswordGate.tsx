import { useState, type ReactNode } from "react";

const STORAGE_KEY = "drr-auth";
const PASSWORD = "algolia-drr-2026";

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true",
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (authenticated) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-bg-default">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 bg-bg-surface border border-border-subtle rounded-2xl p-10 shadow-lg w-full max-w-[380px]"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-ink">DRR Prototype</h1>
          <p className="text-sm text-subdued text-center">
            Enter the password to access this prototype.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Password"
            autoFocus
            className={`w-full px-3 py-2.5 text-sm text-ink bg-bg-surface border rounded-lg placeholder:text-subdued/60 outline-none transition-colors ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-border-subtle focus:border-primary"
            }`}
          />
          {error && (
            <p className="text-xs text-red-500">Incorrect password. Try again.</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
