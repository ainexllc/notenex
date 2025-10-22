"use client";

import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  ChevronDown,
} from "lucide-react";
import { clsx } from "clsx";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-context";
import { useTheme } from "@/components/providers/theme-provider";
import { Container } from "./container";
import { LogoWordmark } from "@/components/branding/logo-wordmark";
import { ProfileDropdown } from "./profile-dropdown";

type TopNavProps = {
  onMenuClick?: () => void;
  onRefresh?: () => void;
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
  onSearchFocus?: () => void;
};

export function TopNav({
  onMenuClick,
  onRefresh,
  onOpenSettings,
  onOpenNotifications,
  onSearchFocus,
}: TopNavProps) {
  const { status, user, signInWithGoogle } = useAuth();
  const { theme } = useTheme();
  const [isProfileOpen, setProfileOpen] = useState(false);


  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? "NN";

  const navBackgroundClass =
    theme === "dark"
      ? "bg-[#050507]/95"
      : "bg-white/92 border-b border-outline-subtle/60";

  return (
    <header
      className={clsx(
        "sticky top-0 z-30 backdrop-blur-2xl shadow-[0_18px_45px_-30px_rgba(0,0,0,0.2)] transition-colors",
        navBackgroundClass,
      )}
    >
      <Container className="flex h-16 items-center gap-3 cq-nav">
        <button
          type="button"
          onClick={onMenuClick}
          className="icon-button h-10 w-10 rounded-full bg-surface-muted/80 shadow-sm transition hover:bg-surface-muted"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <LogoWordmark href="/" iconSize={48} />
        </div>

        <div className="top-nav-search mx-4 flex flex-1 items-center gap-2 rounded-full bg-surface-muted/80 px-4 py-2 shadow-sm transition hover:bg-surface-muted max-w-2xl">
          <Search className="top-nav-search-icon h-4 w-4 text-ink-500" aria-hidden />
          <input
            type="text"
            placeholder="Search notes..."
            className="top-nav-search-input w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-500 focus:outline-none"
            onFocus={() => onSearchFocus?.()}
          />
          <button
            type="button"
            className="top-nav-search-button icon-button h-9 w-9 rounded-full bg-surface-muted/70 text-ink-600 hover:bg-surface-muted"
            aria-label="Open search"
            onClick={() => onSearchFocus?.()}
          >
            <Search className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 top-nav-actions">
          {onOpenNotifications && (
            <button
              type="button"
              onClick={() => onOpenNotifications()}
              className="icon-button h-9 w-9 rounded-full bg-surface-muted/80 shadow-sm transition hover:bg-surface-muted"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
          )}

          {status === "authenticated" ? (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 h-9 rounded-full bg-surface-muted/80 text-ink-700 shadow-sm transition hover:bg-surface-muted px-2"
                aria-label="Profile menu"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName ?? user.email ?? "Account"}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                    sizes="28px"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs font-semibold text-white">
                    {initials}
                  </span>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-ink-500" />
              </button>
              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setProfileOpen(false)}
                onOpenSettings={() => {
                  setProfileOpen(false);
                  onOpenSettings?.();
                }}
                onRefresh={() => {
                  setProfileOpen(false);
                  onRefresh?.();
                }}
              />
            </div>
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
