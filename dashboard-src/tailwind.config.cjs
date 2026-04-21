/**
 * Tailwind config for dashboard-executif only.
 * Theme extension mirrors the previous inline cdn.tailwindcss.com config (navy, gold, pole palette).
 * Content scanning covers the JSX source + the HTML template.
 */
module.exports = {
  content: [
    './dashboard-executif.jsx',
    '../dashboard-executif.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: {
          DEFAULT: '#080E1A',
          2: '#0B1424',
          3: '#121C30',
          4: '#1A2540',
          5: '#243150',
        },
        gold: {
          DEFAULT: '#D9A84F',
          light:   '#E8C36A',
          deep:    '#B8892E',
        },
        pole: {
          amont:    '#2C7AE0',
          inter:    '#10B981',
          aval:     '#F59E0B',
          svc:      '#8B5CF6',
          energies: '#0891B2',
          tech:     '#BE185D',
        },
      },
    },
  },
  corePlugins: {
    // Drop the Tailwind preflight reset — HTML has its own body styles
    // and we want a lean output for a single page.
    preflight: true,
  },
  plugins: [],
};
