'use client';

import { useState, useEffect } from 'react';

export default function ComingSoon() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => {
            if (theme === 'system') setResolvedTheme(media.matches ? 'dark' : 'light');
            else setResolvedTheme(theme);
        };
        updateTheme();
        media.addEventListener('change', updateTheme);
        return () => media.removeEventListener('change', updateTheme);
    }, [theme]);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/signin';
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserEmail(payload.email || 'user@example.com');
        } catch {
            setUserEmail('user@example.com');
        }
    }, []);

    const cycleTheme = () => {
        setTheme(prev => prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system');
    };

    const isDark = resolvedTheme === 'dark';

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center px-6 transition-colors ${isDark ? 'bg-[#0a0a0f] text-white' : 'bg-gray-50 text-gray-900'}`}>

            <button
                onClick={cycleTheme}
                className={`absolute top-5 right-5 p-3 rounded-xl transition-all hover:scale-110 ${isDark ? 'bg-[#1a1a24] text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
                {theme === 'system' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                ) : theme === 'light' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>

            <div className="text-center">
                <div className="text-7xl mb-6">🚀</div>

                <h1 className="text-4xl font-extrabold mb-4 tracking-wide">
                    Nikkagpt is Coming Soon
                </h1>

                <p className={`max-w-md mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Hi {userEmail}, we're almost ready for you.
                    Your smart  AI  — is on the way.
                </p>

                <div className="mt-10">
                    <div className="animate-pulse text-xl font-semibold">
                        Launching shortly…
                    </div>
                </div>

                <div className="mt-16">
                    <a
                        href="/dashboard"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
                    >
                        Go Back Home
                    </a>
                </div>
            </div>
        </div>
    );
}
