/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#11d483",
                "background-light": "#f6f8f7",
                "background-dark": "#10221a",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px",
            },
        },
    },
};
