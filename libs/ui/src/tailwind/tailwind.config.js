const { join } = require("path");

const TailwindAnimate = require("tailwindcss-animate");

module.exports = {
  content: [
    // relative path by consumer app
    "./{src,app,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}",
    // join(
    //   __dirname,
    //   "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"
    // ),
    // path to ui-kit components (relative to current dir)
    join(__dirname, "../components/*.{js,jsx,ts,tsx}")
  ],
  theme: {
    extend: {
      colors: {
        app: "hsl(var(--app))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        "light-gray": "#8792a4b3"
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        },
        "collapsible-down": {
          from: {
            height: "0"
          },
          to: {
            height: "var(--radix-collapsible-content-height)"
          }
        },
        "collapsible-up": {
          from: {
            height: "var(--radix-collapsible-content-height)"
          },
          to: {
            height: "0"
          }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" }
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        marquee: "marquee 20s linear infinite",
        marquee2: "marquee2 20s linear infinite"
      }
    }
  },
  plugins: [TailwindAnimate],
  darkMode: ["class"]
};
