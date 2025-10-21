"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { Container } from "./container";
import { QUICK_CAPTURE_EVENT } from "@/lib/constants/events";
import { useNotes } from "@/components/providers/notes-provider";
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "@/lib/constants/navigation";
import { usePreferences } from "@/components/providers/preferences-provider";
import {
  BellRing,
  CheckCircle2,
  Inbox,
  Lightbulb,
  ListChecks,
  Settings2,
  Sparkles,
  Users,
  MessageSquarePlus,
} from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
};

type ActivePanel = "notifications" | "settings" | "workspace" | null;


const overlayPanelStyles =
  "pointer-events-auto w-full max-w-sm rounded-3xl bg-surface-elevated/95 p-6 shadow-2xl backdrop-blur-xl";

const WORKSPACE_DESCRIPTIONS: Record<string, string> = {
  "/workspace": "Your main board for capturing and organizing notes.",
  "/reminders": "Plan nudges so important notes resurface on time.",
  "/focus": "Deep work canvas with ambient timers and noise.",
  "/shared": "Collaborate in real-time with teammates and partners.",
  "/ideas": "Experiment with AI-assisted brainstorming workflows.",
  "/archive": "Reference shelved notes without cluttering your board.",
  "/trash": "Review and restore anything deleted in the last 30 days.",
};

function formatRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime();

  if (diff < 45_000) {
    return "Just now";
  }

  if (diff < 3_600_000) {
    const minutes = Math.max(1, Math.floor(diff / 60_000));
    return `${minutes}m ago`;
  }

  if (diff < 86_400_000) {
    const hours = Math.max(1, Math.floor(diff / 3_600_000));
    return `${hours}h ago`;
  }

  return date.toLocaleDateString();
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { allNotes, pinned, others, loading } = useNotes();
  const { preferences, updatePreferences, loading: preferencesLoading } = usePreferences();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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

  const handleQuickCapture = useCallback(() => {
    document.dispatchEvent(new CustomEvent(QUICK_CAPTURE_EVENT));
    setActivePanel(null);
  }, []);

  const handleRefresh = useCallback(() => {
    router.refresh();
    setActivePanel(null);
  }, [router]);

  const togglePanel = useCallback((panel: Exclude<ActivePanel, null>) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  const toggleSetting = useCallback(
    (key: "smartSuggestions" | "digestEnabled" | "focusModePinned") => {
      if (preferencesLoading) {
        return;
      }
      void updatePreferences({ [key]: !preferences[key] });
    },
    [preferences, preferencesLoading, updatePreferences],
  );

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

  const workspaceShortcuts = useMemo(
    () =>
      [...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS].map((item) => ({
        ...item,
        description: WORKSPACE_DESCRIPTIONS[item.href] ?? "",
      })),
    [],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-base">
      <div className="relative z-10 flex min-h-screen flex-col text-ink-900">
      <TopNav
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        onRefresh={handleRefresh}
        onOpenSettings={() => togglePanel("settings")}
        onOpenWorkspaceApps={() => togglePanel("workspace")}
        onOpenNotifications={() => togglePanel("notifications")}
      />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex flex-1 justify-center">
          <Container className="w-full pb-12 pt-6" padding="default" variant="wide">
            {children}
          </Container>
        </main>
      </div>

      <Link
        href="/workspace/feedback"
        className="fixed bottom-6 left-6 z-30 inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-ink-50 shadow-floating transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500"
        aria-label="Share feedback"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Feedback
      </Link>

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

              {activePanel === "settings" ? (
                <div className="space-y-4">
                  <header className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
                      <Settings2 className="h-3.5 w-3.5" />
                      Workspace Settings
                    </div>
                    <h2 className="text-lg font-semibold text-ink-800">
                      Tune your experience
                    </h2>
                    <p className="text-sm text-muted">
                      Personalize how NoteNex behaves across devices.
                    </p>
                  </header>

                  <div className="space-y-3">
                    {[
                      {
                        key: "smartSuggestions" as const,
                        title: "Smart suggestions",
                        description:
                          "Surface related notes and labels automatically while you type.",
                        icon: Sparkles,
                      },
                      {
                        key: "digestEnabled" as const,
                        title: "Daily digest email",
                        description:
                          "Receive a morning summary of reminders and upcoming tasks.",
                        icon: Inbox,
                      },
                      {
                        key: "focusModePinned" as const,
                        title: "Focus mode shortcuts",
                        description:
                          "Keep the quick capture panel pinned during focus sessions.",
                        icon: Lightbulb,
                      },
                    ].map(({ key, title, description, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleSetting(key)}
                        disabled={preferencesLoading}
                        className="flex w-full items-center gap-3 rounded-2xl bg-surface-muted/80 px-4 py-3 text-left transition hover:bg-surface-muted"
                        aria-pressed={preferences[key]}
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-muted text-ink-600">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="flex-1 space-y-1">
                          <span className="block text-sm font-semibold text-ink-800">
                            {title}
                          </span>
                          <span className="block text-xs text-muted">
                            {description}
                          </span>
                        </span>
                        <span
                          className={clsx(
                            "flex h-6 w-11 items-center rounded-full bg-surface-muted/80 transition shadow-inner",
                            preferences[key] ? "justify-end bg-accent-500/90" : "justify-start",
                          )}
                          aria-hidden
                        >
                          <span className="mx-1 h-4 w-4 rounded-full bg-white/90 shadow-sm" />
                        </span>
                      </button>
                    ))}
                  </div>

                  <footer className="flex items-center justify-between pt-1 text-xs text-muted">
                    <span>Settings sync automatically to your account.</span>
                    <button
                      type="button"
                      className="font-semibold text-accent-600 hover:text-accent-700"
                      onClick={() => setActivePanel(null)}
                    >
                      Done
                    </button>
                  </footer>
                </div>
              ) : null}

              {activePanel === "workspace" ? (
                <div className="space-y-4">
                  <header className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
                      <Users className="h-3.5 w-3.5" />
                      Workspace Switcher
                    </div>
                    <h2 className="text-lg font-semibold text-ink-800">
                      Navigate faster
                    </h2>
                    <p className="text-sm text-muted">
                      Jump into your most used surfaces in a single click.
                    </p>
                  </header>

                  <div className="space-y-2">
                    {workspaceShortcuts.map(({ label, href, description, icon: Icon }) => (
                      <Link
                        key={label}
                        href={href as Route}
                        onClick={() => {
                          setActivePanel(null);
                        }}
                        className="group flex items-center gap-3 rounded-2xl bg-surface-muted/80 px-4 py-3 transition hover:bg-surface-muted"
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-muted text-ink-600 transition group-hover:text-ink-800">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-ink-800">
                            {label}
                          </span>
                          {description ? (
                            <span className="block text-xs text-muted">
                              {description}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <footer className="rounded-2xl bg-surface-muted px-4 py-3 text-xs text-muted">
                    Tip: Use <span className="kbd-chip">⌘</span>
                    <span className="kbd-chip">K</span> to open the command search anywhere.
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
