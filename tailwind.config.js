/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4CAF50',
                secondary: '#2196F3',
                danger: '#f44336',
            }
        },
    },
    plugins: [],
}
