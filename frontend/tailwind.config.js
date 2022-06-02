const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      "xs": "577px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        "travel-textgray": "var(--travel-textgray)",
        "travel-textgreen": "var(--travel-textgreen)",
        "travel-gold": "var(--travel-gold)",
        "travel-lightgreen": "var(--travel-lightgreen)",
        "travel-green": "var(--travel-green)",
        "travel-darkgreen": "var(--travel-darkgreen)",
        "travel-gray": "var(--travel-gray)",
        "disabled": "var(--disabled)",
        "alert": "var(--alert)",
      },
      backgroundImage: {
        "select-arrow": "url('@/assets/images/svg/icon_select.svg')",
        // "select-arrow": "url('@/assets/images/svg/icon_arrow.svg')",
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('descendant', '& *');
      // addVariant('data-active', ({ modifySelectors, separator }) => {
      //   modifySelectors(({ className }) => {
      //     return `.${e(`data-active${separator}${className}`)}[data-active="true"]`;
      //   })
      // });
    }
  ],
}
