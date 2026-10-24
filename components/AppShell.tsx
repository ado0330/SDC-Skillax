"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserCheck,
  Sparkles,
  Activity,
  Compass,
  Sliders,
  Globe,
  Map,
  TrendingUp,
  History,
  Users,
  BookOpen,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Who Am I Today",
    items: [
      { href: "/", label: "Intelligence", icon: LayoutDashboard },
      { href: "/profile", label: "Skill Profile", icon: UserCheck },
      { href: "/assessment", label: "Assessment", icon: Sparkles },
    ],
  },
  {
    title: "What Tomorrow Holds",
    items: [
      { href: "/radar", label: "Trend Radar", icon: Activity },
      { href: "/careers", label: "Career Matches", icon: Compass },
      { href: "/scenarios", label: "Scenario Lab", icon: Sliders },
      { href: "/sdgs", label: "SDG Impact", icon: Globe },
    ],
  },
  {
    title: "How I Get There",
    items: [
      { href: "/roadmap", label: "Learning Roadmap", icon: Map },
      { href: "/progress", label: "Progress Tracking", icon: TrendingUp },
      { href: "/updates", label: "Replanning & History", icon: History },
    ],
  },
  {
    title: "Organisation",
    items: [
      { href: "/employer", label: "Workforce View", icon: Users },
      { href: "/methodology", label: "Methodology", icon: BookOpen },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    profile,
    scenario,
    simulationBoost,
    pendingProposal,
    theme,
    reducedMotion,
    toggleTheme,
    isProfileInitialized,
  } = useWorkspace();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getInitials = (name: string) => {
    if (!name.trim()) return "?";
    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const scenarioColorMap = {
    slower: "bg-amber-500/10 text-warning border-amber-500/20",
    moderate: "bg-blue-500/10 text-primary border-blue-500/20",
    rapid: "bg-emerald-500/10 text-success border-emerald-500/20",
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto px-4 py-5">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/skillax-logo.png"
              alt="SKILLAX AI logo"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-lg object-contain"
              priority
            />
            <div>
              <span className="text-base font-semibold tracking-tight text-foreground">
                SKILLAX<span className="text-accent-cyan font-mono text-xs ml-1">AI</span>
              </span>
              <p className="text-xs tracking-wide text-muted-foreground">
                Career OS • Domain 1
              </p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="ui-button ui-button-icon rounded p-1 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Card / Chip in Sidebar */}
        <Link
          href="/profile"
          className="ui-button ui-button-secondary group flex items-center gap-3 rounded-lg border border-card-border bg-card/60 p-2.5 transition-all hover:border-primary/40 hover:bg-card"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary ring-2 ring-primary/30">
            {getInitials(profile.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {profile.name || "Set Up Profile"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {profile.occupation || (isProfileInitialized ? "Profile Ready" : "Uninitialized")}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Navigation Groups */}
        <nav className="space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <div className="mt-1 space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "nav-link group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "nav-link-active bg-sidebar-accent text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                        <span>{item.label}</span>
                      </div>
                      {item.href === "/updates" && pendingProposal && (
                        <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-card-border px-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-cyan" />
            No Database • Ephemeral
          </span>
          <span className="font-mono text-xs">v2.0-SDC</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("min-h-screen bg-background", reducedMotion && "reduced-motion")}>
      {/* Desktop Sidebar (Fixed left 256px / 16rem) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-card-border bg-sidebar lg:block">
        {navContent}
      </aside>

      {/* Mobile Drawer (Slide-over < lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-72 max-w-full flex-1 flex-col bg-sidebar shadow-lg">
            {navContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Sticky App Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-card-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="ui-button ui-button-icon rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Scenario Badge */}
            <Link
              href="/scenarios"
              className={cn(
                "ui-button hidden sm:flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-medium transition-colors hover:opacity-80",
                scenarioColorMap[scenario]
              )}
            >
              <span className="capitalize">{scenario} Adoption</span>
              {simulationBoost !== 0 && (
                <span className="font-mono text-xs">
                  ({simulationBoost > 0 ? `+${simulationBoost}` : simulationBoost})
                </span>
              )}
            </Link>

            {/* Replanning Banner / Alert Chip */}
            {pendingProposal && (
              <Link
                href="/updates"
                className="ui-button flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-sm font-semibold text-accent-cyan transition-colors hover:bg-cyan-500/20"
              >
                <Zap className="h-3 w-3 text-accent-cyan animate-pulse" />
                <span>Plan Update Awaiting Review</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Demo Session Active</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ui-button ui-button-icon ui-button-secondary rounded-md border border-card-border bg-card p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-warning" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </button>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 px-4 py-6 sm:px-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
