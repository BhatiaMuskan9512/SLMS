// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         // This links the font we imported in index.html/index.css 
//         // to the Tailwind class 'font-jakarta'
//         jakarta: ["Plus Jakarta Sans", "sans-serif"],
//       },
//       colors: {
//         // You can add custom brand colors here if the video 
//         // uses specific shades (e.g., brand-blue: "#007bff")
//       },
//       boxShadow: {
//         // Custom premium shadows used in the Card and Navbar components
//         'premium': '0 10px 50px -12px rgba(0, 0, 0, 0.05)',
//       }
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This is crucial. We must define 'jakarta' and link it to the font family name.
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        // Defined tutorial brand colors if needed later
        // brandBlue: "#007bff",
      },
      animation: {
        // Special animations used in Hero and other parts
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    },
  },
  plugins: [],
}