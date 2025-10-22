"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { NavigationPanel } from "./navigation-panel";
import { TopNav } from "./top-nav";
import { useNotes } from "@/components/providers/notes-provider";
import { formatRelativeTime } from "@/lib/utils/datetime";
import {
  BellRing,
  CheckCircle2,
  ListChecks,
  MessageSquarePlus,
} from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
};

type ActivePanel = "notifications" | "settings" | null;


const overlayPanelStyles =
  "pointer-events-auto w-full max-w-sm rounded-3xl bg-surface-elevated/95 p-6 shadow-2xl backdrop-blur-xl";

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { allNotes, pinned, others, loading } = useNotes();
  const [isNavOpen, setNavOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  useEffect(() => {
    if (!activePanel) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [activePanel]);

  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const togglePanel = useCallback((panel: Exclude<ActivePanel, null>) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  const activityFeed = useMemo(() => {
    if (!allNotes.length) {
      return [];
    }

    return allNotes
      .slice(0, 5)
      .map((note) => ({
        id: note.id,
        title: note.title || (note.body ? note.body.slice(0, 48) : "Untitled note"),
        timestamp: note.updatedAt,
        pinned: note.pinned,
        type: note.type,
      }));
  }, [allNotes]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-base">
      <div className="relative z-10 flex min-h-screen flex-col text-ink-900">
        <TopNav
          onMenuClick={() => setNavOpen((prev) => !prev)}
          onRefresh={handleRefresh}
          onOpenSettings={() => togglePanel("settings")}
          onOpenNotifications={() => togglePanel("notifications")}
        />

        <main className="flex-1 overflow-x-hidden">
          <div className="centered-shell">
            {children}
          </div>
        </main>

        <Link
          href="/workspace/feedback"
          className="fixed bottom-6 left-6 z-30 inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-ink-50 shadow-floating transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500"
          aria-label="Share feedback"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Feedback
        </Link>

        {/* Navigation overlay panel */}
        {isNavOpen && (
          <div
            className="fixed inset-0 z-30 bg-overlay/60 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
          />
        )}
        <NavigationPanel isOpen={isNavOpen} onClose={() => setNavOpen(false)} />

        {/* Notifications overlay panel */}
        {activePanel ? (
        <div
          className="pointer-events-none fixed inset-0 z-40 flex justify-end bg-transparent"
          aria-hidden={false}
        >
          <button
            type="button"
            className="pointer-events-auto absolute inset-0 cursor-default"
            onClick={() => setActivePanel(null)}
            aria-label="Close quick actions"
          />
          <div className="pointer-events-none flex h-full w-full justify-end px-4 pb-6 pt-[4.5rem] sm:px-6">
            <div className={`${overlayPanelStyles} pointer-events-auto`}>
              {activePanel === "notifications" ? (
                <div className="space-y-4">
                  <header className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
                      <BellRing className="h-3.5 w-3.5" />
                      Activity Center
                    </div>
                    <h2 className="text-lg font-semibold text-ink-800">
                      Recent updates
                    </h2>
                    <p className="text-sm text-muted">
                      Stay on top of reminders, shared notes, and pinned items.
                    </p>
                  </header>

                  {loading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-14 animate-pulse rounded-2xl bg-surface-muted/80"
                        />
                      ))}
                    </div>
                  ) : activityFeed.length ? (
                    <ul className="space-y-2">
                      {activityFeed.map((activity) => (
                        <li
                          key={activity.id}
                          className="flex items-center justify-between rounded-2xl bg-surface-muted/80 px-4 py-3 shadow-sm"
                        >
                          <div>
                            <p className="text-sm font-semibold text-ink-800">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted">
                              Updated {formatRelativeTime(activity.timestamp)}
                            </p>
                          </div>
                          <span
                            className={clsx(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                              activity.pinned
                                ? "bg-accent-100 text-accent-600"
                                : activity.type === "checklist"
                                  ? "bg-ink-100 text-ink-700"
                                  : "bg-surface-muted text-ink-500",
                            )}
                          >
                            {activity.pinned ? (
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                            ) : (
                              <ListChecks className="h-3.5 w-3.5" aria-hidden />
                            )}
                            {activity.pinned ? "Pinned" : activity.type === "checklist"
                              ? "Checklist"
                              : "Note"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-2xl bg-surface-muted/40 px-5 py-6 text-center">
                      <p className="font-semibold text-ink-700">
                        You&apos;re all caught up
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Capture a new idea and it will appear here instantly.
                      </p>
                    </div>
                  )}

                  <footer className="flex items-center justify-between rounded-2xl bg-surface-muted px-4 py-3 text-xs text-muted">
                    <span>
                      {pinned.length} pinned · {others.length} in progress
                    </span>
                    <button
                      type="button"
                      className="font-semibold text-accent-600 hover:text-accent-700"
                      onClick={() => setActivePanel(null)}
                    >
                      Close
                    </button>
                  </footer>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      </div>
    </div>
  );
}
