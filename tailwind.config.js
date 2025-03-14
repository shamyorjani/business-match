module.exports = {
    content: [
        './resources/**/*.{js,jsx,ts,tsx}',
        './resources/**/*.blade.php',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#40033f',
                    light: '#6f0f55',
                    dark: '#2e0130',
                },
                secondary: {
                    DEFAULT: '#9c0c40',
                    light: '#bc0f4d',
                    dark: '#7a0932',
                },
                background: {
                    light: '#F5F8FA',
                    dark: '#121212',
                },
                border: {
                    DEFAULT: '#E1E8ED',
                    dark: '#2a2a2a',
                },
                success: {
                    DEFAULT: '#10B981',
                    light: '#D1FAE5',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    light: '#FEF3C7',
                },
                error: {
                    DEFAULT: '#EF4444',
                    light: '#FEE2E2',
                },
            },
            fontFamily: {
                sans: ['font-instrument', 'Helvetica', 'Arial', 'sans-serif'],
            },
            fontSize: {
                'xs': '0.75rem',
                'sm': '0.875rem',
                'base': '1rem',
                'lg': '1.125rem',
                'xl': '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
                '5xl': '3rem',
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            },
            borderRadius: {
                'none': '0',
                'sm': '0.125rem',
                DEFAULT: '0.25rem',
                'md': '0.375rem',
                'lg': '0.5rem',
                'xl': '0.75rem',
                '2xl': '1rem',
                'full': '9999px',
            },
            spacing: {
                '1': '0.25rem',
                '2': '0.5rem',
                '3': '0.75rem',
                '4': '1rem',
                '6': '1.5rem',
                '8': '2rem',
                '12': '3rem',
                '16': '4rem',
            },
            gradientColorStops: theme => ({
                'primary-start': '#40033f',
                'primary-end': '#9c0c40',
                'secondary-start': '#657786',
                'secondary-end': '#AAB8C2',
            }),
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            transitionProperty: {
                'height': 'height',
                'spacing': 'margin, padding',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
