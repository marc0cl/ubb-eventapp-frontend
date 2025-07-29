/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ubb-blue': '#014898',
                'ubb-blue-dark': '#003272',
                'ubb-red': '#E41B1A',
                'ubb-gray': '#B9BBBB',
                'ubb-yellow': '#F9B214'
            }
        },
    },
    plugins: [],
}