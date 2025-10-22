"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useMemo, useState } from "react";
import {
  Archive,
  Palette,
  Pin,
  PinOff,
  Trash2,
  Users,
} from "lucide-react";
import { clsx } from "clsx";
import type { Note } from "@/lib/types/note";
import { useNotes } from "@/components/providers/notes-provider";
import { NOTE_COLORS } from "@/lib/constants/note-colors";
import { NoteEditor } from "@/components/notes/note-editor";
import { useLabels } from "@/components/providers/labels-provider";
import { getTextColorForBackground } from "@/lib/utils/note-colors";
import { useInspector } from "@/components/workspace/inspector-context";

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  const { togglePin, toggleArchive, deleteNote, updateNote } = useNotes();
  const { labels } = useLabels();
  const { setFocusNoteId } = useInspector();
  const [isEditing, setIsEditing] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const labelMap = useMemo(() => {
    return new Map(labels.map((label) => [label.id, label]));
  }, [labels]);

  const noteLabels = useMemo(() => {
    return note.labelIds
      .map((labelId) => labelMap.get(labelId))
      .filter((label): label is NonNullable<typeof label> => Boolean(label));
  }, [note.labelIds, labelMap]);

  const backgroundClass =
    note.color === "default" ? "bg-surface-elevated" : `bg-${note.color}`;

  const textColors = getTextColorForBackground(note.color);

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await deleteNote(note.id);
  };

  const handleArchive = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await toggleArchive(note.id, !note.archived);
  };

  const handlePin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await togglePin(note.id, !note.pinned);
  };

  const handleInspectorFocus = useCallback(() => {
    setFocusNoteId(note.id);
  }, [note.id, setFocusNoteId]);

  const handleOpenPalette = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowPalette((prev) => !prev);
  };

  const handleColorSelect = async (
    event: React.MouseEvent<HTMLButtonElement>,
    color: Note["color"],
  ) => {
    event.stopPropagation();
    if (color === note.color) {
      setShowPalette(false);
      return;
    }
    await updateNote(note.id, { color });
    setShowPalette(false);
  };

  return (
    <>
      <article
        className={clsx(
          "group relative cursor-pointer break-inside-avoid overflow-visible rounded-3xl px-5 py-4 shadow-lg transition hover:shadow-2xl",
          backgroundClass,
        )}
        onClick={() => {
          handleInspectorFocus();
          setIsEditing(true);
        }}
        onMouseEnter={handleInspectorFocus}
        onFocus={handleInspectorFocus}
      >
        <button
          type="button"
          onClick={handlePin}
          className={clsx(
            "absolute right-4 top-4 hidden rounded-full bg-white/70 p-2 text-ink-500 shadow-sm transition group-hover:flex",
            note.pinned && "text-accent-600",
          )}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
        >
          {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </button>

        <div
          className="max-h-[480px] overflow-y-auto pr-1"
          onScroll={() => {
            // collapse palette when user scrolls content to avoid accidental overlay drift
            if (showPalette) {
              setShowPalette(false);
            }
          }}
        >
          {note.title ? (
            <h3 className={clsx("pr-6 text-base font-semibold", textColors.title)}>
              {note.title}
            </h3>
          ) : null}

          {note.type === "checklist" ? (
            <ul className="mt-3 space-y-2">
              {note.checklist.slice(0, 6).map((item) => (
                <li
                  key={item.id}
                  className={clsx(
                    "flex items-start gap-2 text-sm",
                    item.completed ? textColors.muted + " line-through" : textColors.body,
                  )}
                >
                  <span className={clsx("mt-1 h-2 w-2 rounded-full", note.color === "note-coal" ? "bg-gray-400" : "bg-ink-300")} />
                  <span>{item.text}</span>
                </li>
              ))}
              {note.checklist.length > 6 ? (
                <li className={clsx("text-xs", textColors.muted)}>
                  +{note.checklist.length - 6} more
                </li>
              ) : null}
            </ul>
          ) : note.body ? (
            <p className={clsx("mt-3 whitespace-pre-wrap text-sm", textColors.body)}>
              {note.body}
            </p>
          ) : null}

          {note.attachments.length ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {note.attachments.slice(0, 4).map((attachment) => (
                <figure
                  key={attachment.id}
                  className="overflow-hidden rounded-2xl bg-white/10 shadow-sm"
                >
                  <img
                    src={attachment.downloadURL}
                    alt={attachment.name}
                    className="h-24 w-full object-cover"
                  />
                </figure>
              ))}
              {note.attachments.length > 4 ? (
                <div className="grid place-items-center rounded-2xl bg-white/10 p-4 text-xs font-medium text-ink-600">
                  +{note.attachments.length - 4} more
                </div>
              ) : null}
            </div>
          ) : null}

          {noteLabels.length ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {noteLabels.map((label) => (
                <span
                  key={label.id}
                  className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-ink-600"
                >
                  <span
                    className={clsx(
                      "h-2 w-2 rounded-full",
                      label.color === "default"
                        ? "bg-ink-400"
                        : `bg-${label.color}`,
                    )}
                  />
                  <span>{label.name}</span>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <footer className="mt-4 flex items-center justify-between pt-2">
          <div className={clsx("flex items-center gap-2 text-[11px] uppercase tracking-wide", textColors.muted)}>
            {note.sharedWithUserIds?.length ? (
              <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", note.color === "note-coal" ? "bg-gray-700 text-gray-300" : "bg-surface-muted text-ink-600")}>
                <Users className="h-3 w-3" />
                {note.sharedWithUserIds.length}
              </span>
            ) : null}
            <span>Updated {note.updatedAt.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleArchive}
              className="icon-button h-9 w-9"
              aria-label={note.archived ? "Unarchive note" : "Archive note"}
            >
              <Archive className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={handleOpenPalette}
                className={clsx(
                  "icon-button h-9 w-9",
                  showPalette && "bg-accent-100 text-accent-600",
                )}
                aria-label="Change color"
              >
                <Palette className="h-4 w-4" />
              </button>
              {showPalette ? (
                <div
                  className="absolute bottom-12 right-0 z-30 flex gap-2 rounded-2xl bg-surface-elevated/95 p-3 shadow-floating backdrop-blur-xl"
                  onClick={(event) => event.stopPropagation()}
                >
                  {NOTE_COLORS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={clsx(
                        "h-8 w-8 rounded-full border border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500",
                        option.swatchClass,
                        option.id === note.color && "ring-2 ring-accent-600",
                      )}
                      onClick={(event) => handleColorSelect(event, option.id)}
                      aria-label={`Set color ${option.label}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="icon-button h-9 w-9 text-danger"
              aria-label="Delete note"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </article>

      {isEditing ? (
        <NoteEditor note={note} onClose={() => setIsEditing(false)} />
      ) : null}
    </>
  );
}
