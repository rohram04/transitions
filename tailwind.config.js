/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Signature cue-light amber — used only on the handoff marker and
        // focus rings. The boldness is spent in exactly one place.
        cue: "#FFB020",
        // Owned aurora fallbacks (replaces templated indigo/fuchsia) for
        // transitions whose album art yields no extractable colour.
        seam: {
          a: "#5B53FF",
          b: "#FF5C8A",
          "a-deep": "#2B2780",
          "b-deep": "#7A1F47",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        fluid: "repeat(auto-fill, minmax(30rem, 1fr))",
        "fluid-mobile": "repeat(auto-fill, minmax(20rem, 1fr))",
        scroll: "repeat(auto-fill, minmax(20rem, 1fr))",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".hd-screen": {
          height: "100dvh",
        },
      });
    }),
  ],
};
