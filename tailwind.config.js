/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{js,ts,jsx,tsx}"],

    theme: {
        extend: {
            colors: {
                'primary': {
                    // DEFAULT: '#10B981', 
                    // 'hover': '#059669', 
                },
            },
            FontFace:{

            }
        },
    },
    plugins: [],
};
