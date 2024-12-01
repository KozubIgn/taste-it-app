/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      xs: '340px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1024px',
      xxl: '1440px',
    },
    extend: {
      colors: {
        primaryCol: '#9C27B0',
        primaryDarkCol: '#d45023',
        secondaryDarkCol: '#ddbdb2',
        backgroundCol: '#f9f9f9',
        backgroundRgbCol: 'rgb(250, 250, 250)',
        fontPrimary: '#000000',
        fontSecondary: '#fcfcfc',
        fontLabel: '#E8E8E8',
        fontDisabled: '#7F7F7F',
        lightFontDisabled: '#F5F5F5'
      }
    },
  },
  plugins: [],
}

