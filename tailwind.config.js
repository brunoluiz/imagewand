module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        pwa: { raw: '(display-mode: standalone)' },
      },
    },
  },
  plugins: [],
}
