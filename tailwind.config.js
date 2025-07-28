import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                maroon: '#800000', // Custom maroon color
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(128, 0, 0, 0.5)' },
                    '50%': { boxShadow: '0 0 20px rgba(128, 0, 0, 0.8)' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease-out forwards',
                glow: 'glow 1.5s ease-in-out infinite',
            },
        },
    },

    plugins: [forms],
};
