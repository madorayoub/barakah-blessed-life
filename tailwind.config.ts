import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Islamic Brand Colors
				emerald: {
					50: 'hsl(var(--emerald-50))',
					100: 'hsl(var(--emerald-100))',
					600: 'hsl(var(--emerald-600))',
					700: 'hsl(var(--emerald-700))',
					900: 'hsl(var(--emerald-900))'
				},
				
				// Gold Accent Colors
				gold: {
					400: 'hsl(var(--gold-400))',
					500: 'hsl(var(--gold-500))',
					600: 'hsl(var(--gold-600))'
				},
				
				// Cream Backgrounds
				cream: {
					50: 'hsl(var(--cream-50))',
					100: 'hsl(var(--cream-100))',
					200: 'hsl(var(--cream-200))'
				},
				
				// Neutral Scale
				gray: {
					50: 'hsl(var(--gray-50))',
					100: 'hsl(var(--gray-100))',
					600: 'hsl(var(--gray-600))',
					800: 'hsl(var(--gray-800))',
					900: 'hsl(var(--gray-900))'
				},
				
				// Status Colors
				green: {
					500: 'hsl(var(--green-500))'
				},
				red: {
					500: 'hsl(var(--red-500))'
				},
				yellow: {
					500: 'hsl(var(--yellow-500))'
				},
				
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					dark: 'hsl(var(--primary-dark))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: ['Inter', 'Noto Sans Arabic', '-apple-system', 'sans-serif'],
				body: ['Inter', 'Noto Sans Arabic', '-apple-system', 'sans-serif'],
				display: ['Inter', 'Noto Sans Arabic', '-apple-system', 'sans-serif']
			},
			fontSize: {
				'sm': ['14px', '20px'],
				'base': ['16px', '24px'],
				'lg': ['18px', '28px'],
				'xl': ['20px', '28px'],
				'2xl': ['24px', '32px'],
				'3xl': ['30px', '36px'],
				'4xl': ['36px', '40px']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'sacred': 'var(--shadow-soft)',
				'blessed': 'var(--shadow-medium)',
				'divine': 'var(--shadow-strong)',
				'golden': 'var(--shadow-glow)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'gentle-float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'prayer-pulse': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.9', transform: 'scale(1.02)' }
				},
				'blessing-glow': {
					'0%, 100%': { boxShadow: 'var(--shadow-soft)' },
					'50%': { boxShadow: 'var(--shadow-glow)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gentle-float': 'gentle-float 6s ease-in-out infinite',
				'prayer-pulse': 'prayer-pulse 3s ease-in-out infinite',
				'blessing-glow': 'blessing-glow 4s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
