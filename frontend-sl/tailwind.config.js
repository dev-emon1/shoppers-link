/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          lg: "1.5rem",
          xl: "2rem",
          "2xl": "2rem",
        },
      },

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
        bgDark: "#0B0712",
        bgSurfaceDark: "#141022",
        textPrimaryDark: "#E9E7F6",
        textSecondaryDark: "#BFB7E6",
        textLightDark: "#8E85BA",
        borderDark: "#1B1629",
        borderSoftDark: "#231C35",
      },
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
