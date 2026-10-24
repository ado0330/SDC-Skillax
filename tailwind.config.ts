import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        action: {
          DEFAULT: "hsl(var(--action))",
          hover: "hsl(var(--action-hover))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--foreground))",
          border: "hsl(var(--card-border))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--foreground))",
          accent: "hsl(var(--sidebar-accent))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        accent: {
          cyan: "hsl(var(--cyan))",
          violet: "hsl(var(--violet))",
        },
      },
      borderRadius: {
        lg: "0.625rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        glow: "0 2px 6px rgb(0 0 0 / 0.08)",
        "glow-violet": "0 2px 6px rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
