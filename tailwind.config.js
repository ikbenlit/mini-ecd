/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				// shadcn-svelte colors (HSL format)
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				},
				
				// Mini-ECD colors (var() format)
				ecd: {
					bg: "var(--ecd-bg)",
					surface: "var(--ecd-surface)",
					"sub-surface": "var(--ecd-sub-surface)",
					text: "var(--ecd-text)",
					"text-2": "var(--ecd-text-2)",
					border: "var(--ecd-border)",
					brand: "var(--ecd-brand)",
					"brand-hover": "var(--ecd-brand-hover)",
					"brand-active": "var(--ecd-brand-active)",
					"brand-subtle": "var(--ecd-brand-subtle)",
					success: "var(--ecd-success)",
					warning: "var(--ecd-warning)",
					error: "var(--ecd-error)",
					"error-subtle": "var(--ecd-error-subtle)"
				}
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				// Mini-ECD radius
				"ecd": "var(--ecd-radius)",
				"ecd-sm": "var(--ecd-radius-sm)"
			},
			spacing: {
				// Mini-ECD spacing
				"ecd-1": "var(--ecd-gap-1)",
				"ecd-2": "var(--ecd-gap-2)", 
				"ecd-3": "var(--ecd-gap-3)",
				"ecd-4": "var(--ecd-gap-4)",
				"ecd-5": "var(--ecd-gap-5)",
				"ecd-6": "var(--ecd-gap-6)"
			},
			boxShadow: {
				// Mini-ECD shadows
				"ecd-sm": "var(--ecd-shadow-sm)",
				"ecd-md": "var(--ecd-shadow-md)",
				"ecd-lg": "var(--ecd-shadow-lg)"
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"]
			},
			keyframes: {
				floatBlob: {
					"0%": { transform: "translate(0, 0) scale(1)" },
					"100%": { transform: "translate(-12px, 10px) scale(1.04)" }
				},
				fadeUp: {
					"0%": { opacity: "0", transform: "translateY(6px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				}
			},
			animation: {
				floatBlob: "floatBlob 10s ease-in-out infinite alternate",
				fadeUp: "fadeUp 0.5s ease-in-out forwards"
			},
			backgroundImage: {
				"radial-gradient": "radial-gradient(circle at 30% 30%, var(--ecd-brand-subtle), transparent 70%)"
			}
		}
	},
};

export default config;
