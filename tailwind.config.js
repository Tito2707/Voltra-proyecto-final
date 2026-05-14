export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        voltra: {
          bg: "#1C1C1C",
          text: "#F7F8FC",
          accent: "#CEFF05",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        blatant: ["Blatant", "sans-serif"],
      },
    },
  },
  plugins: [],
};
