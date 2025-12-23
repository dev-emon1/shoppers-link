/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 🟧 Brand Colors
        main: "#E07D42",
        mainHover: "#CF6A2A",
        mainActive: "#B6551E",
        mainSoft: "#ff6d2f11",

        // 🟪 Secondary Colors
        secondary: "#3A2767",
        secondaryHover: "#2F1F54",
        secondaryActive: "#24173F",

        // 🩶 Neutral & Text Colors (Light)
        bgPage: "#F9F7FB",
        bgSurface: "#FFFFFF",
        textPrimary: "#0F1724",
        textSecondary: "#475569",
        textLight: "#888f9e",
        textWhite: "#FFFFFF",
        border: "#E6E9EE",

        // 🟢 Status Colors
        green: "#22C55E",
        deepGreen: "#15803D",
        red: "#EF4444",
        deepRed: "#B91C1C",
        yellow: "#EAB308",
        deepYellow: "#A16207",

        // 🌙 Dark Mode Palette
        bgDark: "#0B0712", // main dark background
        bgSurfaceDark: "#141022", // surface (cards, panels)
        textPrimaryDark: "#E9E7F6", // main text
        textSecondaryDark: "#BFB7E6", // muted text
        textLightDark: "#8E85BA", // optional softer text
        borderDark: "#1B1629", // darker subtle border (updated)
        borderSoftDark: "#231C35", // slightly lighter border (optional)
      },

      // 🧩 Optional Responsive Breakpoints
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1728px",
        "4xl": "1920px",
      },
    },
  },
  plugins: [],
};
