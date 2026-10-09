import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div><h1 className="text-7xl font-bold">404</h1><p className="mt-2 text-muted-foreground">This street doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link></div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center">
      <div><h1 className="text-xl font-semibold">This page didn't load</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button></div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CityPulse — Explore your city smarter" },
      { name: "description", content: "Discover, compare and navigate the city safely with live insights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (<html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>);
}

const nav = [
  { to: "/", label: "Explore" },
  { to: "/heritage", label: "History & Culture" },
  { to: "/safety", label: "Safety" },
  { to: "/compare", label: "Best vs Worst" },
  { to: "/insights", label: "Live Insights" },
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/" className="font-display text-xl font-extrabold">City<span className="text-primary">Pulse</span></Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
                activeProps={{ className: "bg-secondary !text-foreground" }}>{n.label}</Link>
            ))}
          </nav>
          <span className="ml-auto chip"><span className="h-2 w-2 animate-pulse rounded-full bg-success" />Mumbai · live</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8"><Outlet /></main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">CityPulse · demo data for Mumbai</footer>
    </QueryClientProvider>
  );
}
