module.exports = {
  content: ["./public/**/*.{html,js,css}"],
  theme: {
    extend: {
      screens: {
        pwa: { raw: '(display-mode: standalone)' },
      },
    },
  },
  plugins: [],
}
