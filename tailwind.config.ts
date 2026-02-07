/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'boutique-gold': '#D4AF37', // Para detalles de lujo
        'boutique-dark': '#1A1A1A', // Fondo elegante
        'boutique-rose': '#FBCFE8', // Para la sección de flores
      },
    },
  },
  plugins: [],
}