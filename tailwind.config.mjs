/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'canvas-mist': 'var(--color-canvas-mist, #f2f4f5)',
        'pure-white': 'var(--color-pure-white, #ffffff)',
        'ink-black': 'var(--color-ink-black, #000000)',
        'faint-border': 'var(--color-faint-border, #ebebeb)',
        'muted-gray': 'var(--color-muted-gray, #787574)',
        'cool-stone': 'var(--color-cool-stone, #cccccc)',
        'warm-fog': 'var(--color-warm-fog, #acb0aa)',
        'warm-accent': 'var(--color-warm-accent, #ea580c)',
        'accent-wash': 'var(--color-accent-wash, rgba(234, 88, 12, 0.12))',
        'shop-violet': 'var(--color-warm-accent, #ea580c)',
        'violet-wash': 'var(--color-accent-wash, rgba(234, 88, 12, 0.12))',
        'slate-ink': 'var(--color-slate-ink, #332f2d)',
        'ash-veil': 'var(--color-ash-veil, #665a54)',
      },
      borderRadius: {
        'cards': '28px',
        'inner-img': '20px',
        'pills': '20px',
        'chips': '9999px',
        'inputs': '9999px',
        'buttons': '9999px',
      },
      boxShadow: {
        'sm': 'rgba(0, 0, 0, 0.06) 0px 2px 8px 0px',
        'sm-2': 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px',
        'lg': 'rgba(0, 0, 0, 0.12) 0px 4px 24px 0px',
        'lg-2': 'rgba(69, 36, 219, 0.34) 0px 4px 24px 0px',
      },
      letterSpacing: {
        'shop-display': '-0.05em',
        'shop-body': '-0.031em',
        'shop-sub': '-0.014em',
        'shop-caption': '-0.017em',
        'shop-micro': '-0.058em',
      },
      fontFamily: {
        'gt-standard': ['var(--font-gt-standard)', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        'shop-container': '1200px',
      },
    },
  },
  plugins: [],
};
