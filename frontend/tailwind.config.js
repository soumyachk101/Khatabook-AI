const nextThemes = require("next-themes");

/** @type {import('tailwindcss').Config} */
module.exports = {
 darkMode: ["class"],
 content: [
 "./src/pages/**/*.{js,jsx}",
 "./src/components/**/*.{js,jsx}",
 "./src/app/**/*.{js,jsx}",
 ],
 theme: {
 extend: {
 fontFamily: {
 sans: ["var(--font-inter)", "system-ui", "sans-serif"],
 },
 colors: {
 primary: {
 50: "#eef2ff",
 100: "#e0e7ff",
 200: "#c7d2fe",
 300: "#a5b4fc",
 400: "#818cf8",
 500: "#6366f1",
 600: "#4f46e5",
 700: "#4338ca",
 800: "#3730a3",
 900: "#312e81",
 },
 upi: "#009688",
 },
 keyframes: {
 "accordion-down": {
 from: { height: "0" },
 to: { height: "var(--radix-accordion-content-height)" },
 },
 "accordion-up": {
 from: { height: "var(--radix-accordion-content-height)" },
 to: { height: "0" },
 },
 },
 animation: {
 "accordion-down": "accordion-down 0.2s ease-out",
 "accordion-up": "accordion-up 0.2s ease-out",
 },
 },
 },
 plugins: [require("tailwindcss-animate")],
};
