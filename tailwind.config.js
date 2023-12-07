/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      width: {
        '500': '500px',
      },
      boxShadow: {
        'inner-strong': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)', 
      }
    },
  },
  plugins: [],
}

