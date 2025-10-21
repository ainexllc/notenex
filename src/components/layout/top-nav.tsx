"use client";

import {
  AppWindow,
  Bell,
  Menu,
  Moon,
  RefreshCw,
  Search,
  Settings2,
  Sun,
} from "lucide-react";
import { clsx } from "clsx";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-context";
import { useTheme } from "@/components/providers/theme-provider";
import { Container } from "./container";
import { LogoWordmark } from "@/components/branding/logo-wordmark";

type TopNavProps = {
  onMenuClick?: () => void;
  onRefresh?: () => void;
  onOpenSettings?: () => void;
  onOpenWorkspaceApps?: () => void;
  onOpenNotifications?: () => void;
  onSearchFocus?: () => void;
};

export function TopNav({
  onMenuClick,
  onRefresh,
  onOpenSettings,
  onOpenWorkspaceApps,
  onOpenNotifications,
  onSearchFocus,
}: TopNavProps) {
  const { status, user, signInWithGoogle, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const quickActions = [
    {
      label: "Refresh",
      icon: RefreshCw,
      handler: onRefresh,
    },
    {
      label: "Settings",
      icon: Settings2,
      handler: onOpenSettings,
    },
    {
      label: "Workspace apps",
      icon: AppWindow,
      handler: onOpenWorkspaceApps,
    },
    {
      label: "Notifications",
      icon: Bell,
      handler: onOpenNotifications,
    },
  ].filter(({ handler }) => Boolean(handler));

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? "NN";

  return (
    <header className="sticky top-0 z-30 bg-surface-base/95 backdrop-blur-2xl shadow-[0_18px_45px_-30px_rgba(0,0,0,0.8)]">
      <Container className="flex h-16 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="icon-button h-10 w-10 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden lg:block">
          <LogoWordmark href="/" iconSize={48} />
        </div>

        <div className="mx-4 flex flex-1 items-center gap-2 rounded-full bg-surface-muted/80 px-4 py-2 shadow-sm transition hover:bg-surface-muted max-w-2xl">
          <Search className="h-4 w-4 text-ink-500" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-500 focus:outline-none"
            onFocus={() => onSearchFocus?.()}
          />
        </div>

        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={toggleTheme}
            className="icon-button h-9 w-9 rounded-full bg-surface-muted/80 shadow-sm transition hover:bg-surface-muted"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {quickActions.map(({ icon: Icon, label, handler }) => (
            <button
              key={label}
              type="button"
              onClick={() => handler?.()}
              className="icon-button hidden h-9 w-9 md:grid"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}

          {status === "authenticated" ? (
            <button
              type="button"
              className="icon-button h-9 w-9 rounded-full bg-surface-muted/80 text-ink-700 shadow-sm transition hover:bg-surface-muted"
              aria-label="Sign out"
              onClick={() => void signOut()}
            >
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName ?? user.email ?? "Account"}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                  sizes="36px"
                />
              ) : (
                <span className="text-xs font-semibold">{initials}</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              className="rounded-full bg-surface-muted/80 px-3 py-1.5 text-xs font-medium text-ink-600 shadow-sm transition hover:bg-surface-muted hover:text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              onClick={() => void signInWithGoogle()}
            >
              Sign in
            </button>
          )}
        </div>
      </Container>
    </header>
  );
}
