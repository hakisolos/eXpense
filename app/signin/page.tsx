'use client';

import { useState, useEffect } from 'react';

export default function SignInPage() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateResolvedTheme = () => {
            if (theme === 'system') {
                setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
            } else {
                setResolvedTheme(theme);
            }
        };

        updateResolvedTheme();
        mediaQuery.addEventListener('change', updateResolvedTheme);

        return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
    }, [theme]);

    const cycleTheme = () => {
        setTheme(prev => {
            if (prev === 'system') return 'light';
            if (prev === 'light') return 'dark';
            return 'system';
        });
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async () => {
        setError('');

        // Basic validation
        if (!email) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            // ============================================
            // 🔧 BACKEND URL CONFIGURATION
            // Update this to your backend URL
            // ============================================
            const BACKEND_URL = 'http://172.20.10.4:4000';
            const apiUrl = `${BACKEND_URL}/api/signin`;

            console.log('Making request to:', apiUrl);
            console.log('Request body:', { email });

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                mode: 'cors', // Explicitly set CORS mode
            });

            console.log('Response status:', response.status);

            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Sign in failed');
            }

            // Success - show confirmation message
            alert(`Check your email! We've sent a confirmation link to ${email}`);
            setEmail('');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSubmit();
        }
    };

    const isDark = resolvedTheme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
            {/* Navigation */}
            <nav className={`border-b transition-colors ${isDark ? 'bg-[#0f0f14] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <a href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>eXpense</span>
                        </a>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={cycleTheme}
                                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'bg-[#1a1a24] text-gray-300 hover:bg-[#24242e]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                title={`Theme: ${theme}`}
                            >
                                {theme === 'system' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                ) : theme === 'light' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sign In Form */}
            <div className="flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Welcome back
                        </h1>
                        <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Sign in to continue to your account
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className={`rounded-2xl p-8 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200 shadow-xl'}`}>
                        <div className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="you@example.com"
                                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                        ? 'bg-[#1a1a26] border-[#2a2a35] text-white placeholder-gray-500 focus:bg-[#1f1f2e]'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                        }`}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-500">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>

                        {/* Success Message */}
                        {!error && email === '' && !isLoading && (
                            <div className="mt-6 flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-green-500">Check your email for the confirmation link!</p>
                            </div>
                        )}

                        {/* Help Text */}
                        <div className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <p>
                                We'll send you a magic link to sign in.
                            </p>
                        </div>
                    </div>

                    {/* Terms */}
                    <p className={`mt-6 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        By signing in, you agree to our{' '}
                        <a href="/terms" className="underline hover:text-blue-500">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="underline hover:text-blue-500">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}