"use client";

import { type ElementType, useMemo } from "react";
import {
  Archive,
  Clock,
  Filter,
  CheckSquare,
  MessageCircle,
  NotebookPen,
  Pin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { clsx } from "clsx";
import { useNotes } from "@/components/providers/notes-provider";
import { useLabels } from "@/components/providers/labels-provider";
import type { Note } from "@/lib/types/note";
import { formatRelativeTime } from "@/lib/utils/datetime";
import { useInspector } from "@/components/workspace/inspector-context";
import { getTextColorForBackground } from "@/lib/utils/note-colors";

type ActivityItem = {
  id: string;
  title: string;
  timestamp: Date;
  pinned: boolean;
  type: Note["type"];
};

type WorkspaceInspectorProps = {
  activity: ActivityItem[];
  loading: boolean;
  onOpenActivity?: () => void;
};

const NOTE_TYPE_META: Record<Note["type"], { label: string; icon: ElementType }> = {
  text: { label: "Text", icon: MessageCircle },
  checklist: { label: "Checklist", icon: CheckSquare },
};

export function WorkspaceInspector({ activity, loading, onOpenActivity }: WorkspaceInspectorProps) {
  const { pinned, others, allNotes, searchQuery, activeLabelIds } = useNotes();
  const { labels } = useLabels();
  const { focusNote, clearFocus } = useInspector();

  const totalNotes = pinned.length + others.length;
  const archivedCount = useMemo(
    () => allNotes.filter((note) => note.archived).length,
    [allNotes],
  );
  const sharedCount = useMemo(
    () => allNotes.filter((note) => note.sharedWithUserIds?.length).length,
    [allNotes],
  );

  const labelMap = useMemo(
    () => new Map(labels.map((label) => [label.id, label])),
    [labels],
  );

  const activeLabels = useMemo(() => {
    return activeLabelIds
      .map((labelId) => labelMap.get(labelId))
      .filter((label): label is NonNullable<typeof label> => Boolean(label));
  }, [labelMap, activeLabelIds]);

  const focusNoteLabels = useMemo(() => {
    if (!focusNote) {
      return [];
    }
    return focusNote.labelIds
      .map((labelId) => labelMap.get(labelId))
      .filter((label): label is NonNullable<typeof label> => Boolean(label));
  }, [focusNote, labelMap]);

  const focusNoteMeta = useMemo(() => {
    if (!focusNote) {
      return [];
    }

    const typeMeta = NOTE_TYPE_META[focusNote.type];
    const meta: Array<{ label: string; icon: ElementType }> = [
      { label: typeMeta.label, icon: typeMeta.icon },
    ];

    if (focusNote.pinned) {
      meta.push({ label: "Pinned", icon: Pin });
    }

    if (focusNote.archived) {
      meta.push({ label: "Archived", icon: Archive });
    }

    if (focusNote.sharedWithUserIds?.length) {
      meta.push({
        label: `${focusNote.sharedWithUserIds.length} collaborator${focusNote.sharedWithUserIds.length > 1 ? "s" : ""}`,
        icon: Users,
      });
    }

    if (focusNote.reminderAt) {
      meta.push({
        label: `Reminder ${focusNote.reminderAt.toLocaleString()}`,
        icon: Clock,
      });
    }

    return meta;
  }, [focusNote]);

  const focusNoteText = useMemo(() => {
    if (!focusNote) {
      return null;
    }
    return getTextColorForBackground(focusNote.color);
  }, [focusNote]);

  const hasFilters =
    activeLabels.length > 0 || (searchQuery && searchQuery.trim().length > 0);

  const stats = [
    {
      label: "Total notes",
      value: totalNotes,
      icon: NotebookPen,
    },
    {
      label: "Pinned",
      value: pinned.length,
      icon: Pin,
    },
    {
      label: "Shared",
      value: sharedCount,
      icon: Users,
    },
    {
      label: "Archived",
      value: archivedCount,
      icon: Archive,
    },
  ];

  return (
    <aside className="app-shell-inspector cq-inspector rounded-3xl border border-outline-subtle/40 bg-surface-elevated/80 p-6 text-sm text-ink-300 shadow-inner">
      <div className="space-y-7">
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                Selected note
              </p>
              <h2 className="text-lg font-semibold text-ink-50">
                {focusNote ? focusNote.title || "Untitled note" : "Hover or open a note"}
              </h2>
            </div>
            {focusNote ? (
              <button
                type="button"
                onClick={clearFocus}
                className="inline-flex items-center gap-1 rounded-full bg-surface-muted/80 px-3 py-1 text-xs font-semibold text-ink-400 transition hover:bg-surface-muted hover:text-ink-200"
              >
                Clear
              </button>
            ) : null}
          </div>

          {focusNote ? (
            <div
              className={clsx(
                "space-y-3 rounded-2xl border border-outline-subtle/30 px-4 py-4 shadow-inner",
                focusNote.color === "default" ? "bg-surface-muted/70" : `bg-${focusNote.color}-soft`,
              )}
            >
              <div className="space-y-1">
                <p
                  className={clsx(
                    "text-xs font-semibold uppercase tracking-wide",
                    focusNoteText?.muted ?? "text-ink-400",
                  )}
                >
                  Updated {formatRelativeTime(focusNote.updatedAt)}
                </p>
                {focusNote.body && focusNote.type === "text" ? (
                  <p
                    className={clsx(
                      "text-sm leading-relaxed",
                      focusNoteText?.body ?? "text-ink-200",
                    )}
                  >
                    {focusNote.body.length > 220
                      ? `${focusNote.body.slice(0, 220)}…`
                      : focusNote.body}
                  </p>
                ) : null}
              </div>

              {focusNote.type === "checklist" ? (
                <ul className="space-y-2">
                  {focusNote.checklist.slice(0, 3).map((item) => (
                    <li
                      key={item.id}
                      className={clsx(
                        "flex items-start gap-2 text-sm",
                        focusNoteText?.body ?? "text-ink-100",
                      )}
                    >
                      <CheckSquare className="mt-0.5 h-4 w-4" />
                      <span className={clsx(item.completed && "line-through opacity-80")}>{item.text}</span>
                    </li>
                  ))}
                  {focusNote.checklist.length > 3 ? (
                    <li className={clsx("text-xs", focusNoteText?.muted ?? "text-ink-300")}
                    >
                      +{focusNote.checklist.length - 3} more
                    </li>
                  ) : null}
                </ul>
              ) : null}

              {!focusNote.body && focusNote.type === "text" ? (
                <p className={clsx("text-xs italic", focusNoteText?.muted ?? "text-ink-400")}
                >
                  Start typing to add body content.
                </p>
              ) : null}

              {focusNoteLabels.length ? (
                <div className="flex flex-wrap gap-2">
                  {focusNoteLabels.map((label) => (
                    <span
                      key={label.id}
                      className="inline-flex items-center gap-2 rounded-full bg-surface-base/70 px-3 py-1 text-xs font-medium text-ink-400"
                    >
                      <span
                        className={clsx(
                          "h-2.5 w-2.5 rounded-full",
                          label.color === "default" ? "bg-ink-400" : `bg-${label.color}`,
                        )}
                      />
                      {label.name}
                    </span>
                  ))}
                </div>
              ) : null}

              {focusNoteMeta.length ? (
                <div className="flex flex-wrap gap-2">
                  {focusNoteMeta.map(({ label, icon: Icon }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full bg-surface-base/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-400"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-ink-500">
              Hover or open a note in the board to preview its details here.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              Workspace snapshot
            </p>
            <h2 className="text-lg font-semibold text-ink-50">
              Stay oriented at a glance
            </h2>
          </div>
          <div className="inspector-stat-grid">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-outline-subtle/30 bg-surface-base/70 px-4 py-3 text-left shadow-inner"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    {label}
                  </p>
                  <p className="text-2xl font-semibold text-ink-50">{value}</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-muted text-ink-300">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              Active filters
            </h3>
            {hasFilters ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                <Filter className="h-3 w-3" />
                Filters on
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wide text-ink-500">
                None
              </span>
            )}
          </div>

          {hasFilters ? (
            <div className="flex flex-wrap gap-2">
              {searchQuery.trim() ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted/70 px-3 py-1 text-xs font-medium text-ink-500">
                  <Search className="h-3.5 w-3.5" />
                  &quot;{searchQuery.trim()}&quot;
                </span>
              ) : null}

              {activeLabels.map((label) => (
                <span
                  key={label.id}
                  className="inline-flex items-center gap-2 rounded-full bg-surface-muted/70 px-3 py-1 text-xs font-medium text-ink-500"
                >
                  <span
                    className={clsx(
                      "h-2.5 w-2.5 rounded-full",
                      label.color === "default" ? "bg-ink-400" : `bg-${label.color}`,
                    )}
                  />
                  {label.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-500">
              Use labels or search to focus on what matters. Filters will appear here when active.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                Recent activity
              </h3>
              <p className="text-xs text-ink-500">
                Last five updates across your workspace
              </p>
            </div>
            {onOpenActivity ? (
              <button
                type="button"
                onClick={onOpenActivity}
                className="inline-flex items-center gap-1 rounded-full bg-surface-muted/80 px-3 py-1 text-xs font-semibold text-ink-400 transition hover:bg-surface-muted hover:text-ink-200"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Open center
              </button>
            ) : null}
          </div>

          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-2xl border border-outline-subtle/20 bg-surface-muted/60"
                />
              ))
            ) : activity.length ? (
              activity.map((item) => {
                const { icon: NoteTypeIcon, label } = NOTE_TYPE_META[item.type];
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-outline-subtle/30 bg-surface-muted/70 px-4 py-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-ink-50">
                        {item.title}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-ink-400">
                      {item.pinned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-base/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                          <Pin className="h-3 w-3" />
                          Pinned
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-ink-400">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(item.timestamp)}
                      </span>
                      </p>
                    </div>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-surface-base/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-300">
                      <NoteTypeIcon className="h-3 w-3" />
                      {label}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-outline-subtle/30 bg-surface-muted/60 px-4 py-6 text-center text-xs text-ink-500">
                Updates will appear here once you start creating or sharing notes.
              </div>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
