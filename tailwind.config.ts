import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#000000",
        raised: "#0a0a0b",
        graphite: "#141416",
        charcoal: "#1c1c1f",
        line: "#26262a",
        bone: "#e8e6e1",
        silver: "#9a9aa0",
        gunmetal: "#5a5a62",
        champagne: "#8a7a5c",
        amber: "#a08858"
      },
      fontFamily: {
        sans: ["'Archivo Variable'", "system-ui", "sans-serif"],
        serif: ["'Newsreader Variable'", "Georgia", "serif"]
      },
      letterSpacing: {
        widest2: "0.35em",
        vast: "0.5em"
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};
export default config;
