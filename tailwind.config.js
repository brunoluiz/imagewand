module.exports = {
  content: ["./app/**/*.{html,js,css}"],
  theme: {
    extend: {
      screens: {
        pwa: { raw: "(display-mode: standalone)" },
      },
    },
  },
  plugins: [],
};
