import type { NoteColor } from "@/lib/types/note";

/**
 * Determines if a note color should use dark text (for light backgrounds)
 * or light text (for dark backgrounds), similar to Google Keep's approach.
 */
export function getTextColorForBackground(color: NoteColor): {
  title: string;
  body: string;
  muted: string;
  placeholder: string;
} {
  // Dark background colors need light text
  if (color === "note-coal") {
    return {
      title: "text-white",
      body: "text-gray-200",
      muted: "text-gray-300",
      placeholder: "placeholder:text-gray-400",
    };
  }

  // Light background colors (including white) need dark text
  if (color !== "default") {
    return {
      title: "text-gray-900",
      body: "text-gray-800",
      muted: "text-gray-700",
      placeholder: "placeholder:text-gray-600",
    };
  }

  // Default uses theme-based colors
  return {
    title: "text-ink-800",
    body: "text-ink-700",
    muted: "text-ink-500",
    placeholder: "placeholder:text-ink-400",
  };
}
