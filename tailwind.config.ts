import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "var(--background-color)",
        secondary: "var(--sideColor)",
        bw: "var(--blackWhite)",
        btnText: "",
        paleGreen: "var(--text-color)",
        column: "var(--columnColor)",
        task: "var(--taskColor)",
        sideBorder: "var(--borderColor)",
        boardTitle: "var(--boardTitle)",
        dropText: "var(--dropTextColor)"
      },
    },
  },
  plugins: [],
};
export default config;
