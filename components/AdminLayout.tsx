import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, type ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/messages", label: "Messages", badge: true },
  { href: "/admin/settings", label: "Settings" },
] as const;

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
};

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const loadUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/admin-stats", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.data) {
        setUnread(Number(data.data.unread_messages || 0));
      }
    } catch {
      // ignore badge errors
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/admin-auth", { credentials: "include" });
        const data = await res.json();
        if (!res.ok || !data.authenticated) {
          router.replace("/admin/login");
          return;
        }
        if (active) {
          setUsername(data.user?.username || "admin");
          setChecking(false);
          loadUnread();
        }
      } catch {
        router.replace("/admin/login");
      }
    })();

    return () => {
      active = false;
    };
  }, [router, loadUnread]);

  useEffect(() => {
    const onUpdate = () => loadUnread();
    window.addEventListener("admin-messages-updated", onUpdate);
    return () => window.removeEventListener("admin-messages-updated", onUpdate);
  }, [loadUnread]);

  const logout = async () => {
    await fetch("/api/admin-logout", { method: "POST", credentials: "include" });
    router.replace("/admin/login");
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return router.pathname === href;
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-primary">
        <p className="text-sm font-medium">Checking admin session...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title} | QHC Admin</title>
      </Head>

      <div className="min-h-screen bg-surface lg:flex">
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-primary text-white transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="border-b border-white/10 px-5 py-5">
            <p className="font-display text-2xl font-bold">QHC</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-secondary-light">
              Admin Panel
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive(item.href, Boolean((item as { exact?: boolean }).exact))
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {"badge" in item && item.badge && unread > 0 ? (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4 text-xs text-white/60">
            Signed in as <span className="font-semibold text-white">{username}</span>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-primary lg:hidden"
                aria-label="Open sidebar"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  QHC Admin
                </p>
                <h1 className="text-lg font-semibold text-primary sm:text-xl">{title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:inline-flex"
              >
                View Site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </>
  );
}
