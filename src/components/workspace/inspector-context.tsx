"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Note } from "@/lib/types/note";
import { useNotes } from "@/components/providers/notes-provider";

type InspectorContextValue = {
  focusNoteId: string | null;
  setFocusNoteId: (noteId: string | null) => void;
  focusNote: Note | null;
  clearFocus: () => void;
};

const InspectorContext = createContext<InspectorContextValue | null>(null);

type InspectorProviderProps = {
  children: React.ReactNode;
};

export function InspectorProvider({ children }: InspectorProviderProps) {
  const { allNotes } = useNotes();
  const [focusNoteId, setFocusNoteId] = useState<string | null>(null);

  const value = useMemo<InspectorContextValue>(() => {
    const focusNote =
      focusNoteId ? allNotes.find((note) => note.id === focusNoteId) ?? null : null;

    return {
      focusNoteId,
      setFocusNoteId,
      focusNote,
      clearFocus: () => setFocusNoteId(null),
    };
  }, [focusNoteId, allNotes]);

  return <InspectorContext.Provider value={value}>{children}</InspectorContext.Provider>;
}

export function useInspector() {
  const context = useContext(InspectorContext);
  if (!context) {
    throw new Error("useInspector must be used within an InspectorProvider");
  }
  return context;
}
