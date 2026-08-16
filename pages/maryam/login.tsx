import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin-auth", { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.authenticated) {
          router.replace("/maryam");
          return;
        }
      } catch {
        // stay on login
      } finally {
        setChecking(false);
      }
    })();
  }, [router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin-login", { method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Login failed.");
        return;
      }
      router.replace(data.redirectTo || "/maryam");
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary text-white">
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Login | QHC</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-hero-glow px-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            QHC Admin
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-primary">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage appointments, services, content, and messages.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}
