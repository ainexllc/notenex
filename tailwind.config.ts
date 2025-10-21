import type { Config } from "tailwindcss";

const withOpacityValue = (variable: string): string => {
  return `rgb(var(${variable}) / <alpha-value>)`;
};

const noteTones = [
  "white",
  "lemon",
  "peach",
  "tangerine",
  "mint",
  "fog",
  "lavender",
  "blush",
  "sky",
  "moss",
  "coal",
];

const noteColorSafelist = noteTones.flatMap((tone) => [
  `bg-note-${tone}`,
  `bg-note-${tone}-soft`,
  `hover:bg-note-${tone}`,
  `hover:bg-note-${tone}-soft`,
]);

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: withOpacityValue("--color-surface-base"),
          muted: withOpacityValue("--color-surface-muted"),
          elevated: withOpacityValue("--color-surface-elevated"),
        },
        overlay: withOpacityValue("--color-surface-overlay"),
        outline: {
          subtle: withOpacityValue("--color-outline-subtle"),
          strong: withOpacityValue("--color-outline-strong"),
        },
        accent: {
          DEFAULT: withOpacityValue("--color-accent-500"),
          50: withOpacityValue("--color-accent-50"),
          100: withOpacityValue("--color-accent-100"),
          200: withOpacityValue("--color-accent-200"),
          300: withOpacityValue("--color-accent-300"),
          400: withOpacityValue("--color-accent-400"),
          500: withOpacityValue("--color-accent-500"),
          600: withOpacityValue("--color-accent-600"),
          700: withOpacityValue("--color-accent-700"),
          800: withOpacityValue("--color-accent-800"),
          900: withOpacityValue("--color-accent-900"),
        },
        ink: {
          50: withOpacityValue("--color-ink-50"),
          100: withOpacityValue("--color-ink-100"),
          200: withOpacityValue("--color-ink-200"),
          300: withOpacityValue("--color-ink-300"),
          400: withOpacityValue("--color-ink-400"),
          500: withOpacityValue("--color-ink-500"),
          600: withOpacityValue("--color-ink-600"),
          700: withOpacityValue("--color-ink-700"),
          800: withOpacityValue("--color-ink-800"),
          900: withOpacityValue("--color-ink-900"),
        },
        success: withOpacityValue("--color-success"),
        warning: withOpacityValue("--color-warning"),
        danger: withOpacityValue("--color-danger"),
        note: {
          white: "#FFFFFF",
          "white-soft": "#F9FAFB",
          lemon: "#FEFEA1",
          "lemon-soft": "#FFFED2",
          peach: "#FEC4A3",
          "peach-soft": "#FFE1CE",
          tangerine: "#FFD27F",
          "tangerine-soft": "#FFE7BA",
          mint: "#BBF7D0",
          "mint-soft": "#DCFCE7",
          fog: "#E0ECFF",
          "fog-soft": "#EDF3FF",
          lavender: "#EAD8FF",
          "lavender-soft": "#F3E8FF",
          blush: "#FAD7E5",
          "blush-soft": "#FCE6EF",
          sky: "#CDE3FF",
          "sky-soft": "#E3F0FF",
          moss: "#D5F5C1",
          "moss-soft": "#E8FAD9",
          coal: "#4F5B66",
          "coal-soft": "#A1A8B0",
        },
      },
      fontFamily: {
        sans: "var(--font-geist-sans)",
        mono: "var(--font-geist-mono)",
      },
      boxShadow: {
        floating: "0 14px 30px -18px rgba(15, 23, 42, 0.45)",
        inset: "inset 0 0 0 1px rgba(148, 163, 184, 0.2)",
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
    },
  },
  safelist: noteColorSafelist,
  plugins: [],
};

export default config;
