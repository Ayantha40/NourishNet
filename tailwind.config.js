/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        kthin: ["K2D-Thin", "sans-serif"],
        kthinitalic: ["K2D-ThinItalic", "sans-serif"],
        kextralight: ["K2D-ExtraLight", "sans-serif"],
        kextralightitalic: ["K2D-ExtraLightItalic", "sans-serif"],
        klight: ["K2D-Light", "sans-serif"],
        klightitalic: ["K2D-LightItalic", "sans-serif"],
        kregular: ["K2D-Regular", "sans-serif"],
        kitalic: ["K2D-Italic", "sans-serif"],
        kmedium: ["K2D-Medium", "sans-serif"],
        kmediumitalic: ["K2D-MediumItalic", "sans-serif"],
        ksemibold: ["K2D-SemiBold", "sans-serif"],
        ksemibolditalic: ["K2D-SemiBoldItalic", "sans-serif"],
        kbold: ["K2D-Bold", "sans-serif"],
        kbolditalic: ["K2D-BoldItalic", "sans-serif"],
        kextrabold: ["K2D-ExtraBold", "sans-serif"],
        kextrabolditalic: ["K2D-ExtraBoldItalic", "sans-serif"],
      },
    },
  },
  plugins: [],
};