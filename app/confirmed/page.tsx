'use client';

import { useState, useEffect } from 'react';

export default function ConfirmedPage() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
    const [countdown, setCountdown] = useState(4);
    const [progress, setProgress] = useState(0);
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

    // Extract and store token on mount
    useEffect(() => {
        try {
            // Get token from URL query parameter
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (!token) {
                setError('No authentication token found');
                return;
            }

            // Store token in localStorage
            localStorage.setItem('auth_token', token);
            console.log('Token stored successfully');

        } catch (err) {
            console.error('Error storing token:', err);
            setError('Failed to authenticate. Please try again.');
        }
    }, []);

    useEffect(() => {
        // Only start countdown if no error
        if (error) return;

        // Progress bar animation (0 to 100 over 4 seconds)
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + (100 / 40); // Update every 100ms for smooth animation
            });
        }, 100);

        // Countdown timer (4 to 0)
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Redirect after 4 seconds
        const redirectTimeout = setTimeout(() => {
            handleRedirect();
        }, 4000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(countdownInterval);
            clearTimeout(redirectTimeout);
        };
    }, [error]);

    const handleRedirect = () => {
        // Verify token exists before redirecting
        const token = localStorage.getItem('auth_token');

        if (!token) {
            setError('Authentication failed. Please try signing in again.');
            return;
        }

        // ============================================
        // 🔧 INTEGRATION PLACEHOLDER
        // Update this to match your dashboard route
        // ============================================
        window.location.href = '/dashboard';
        // or if using Next.js router:
        // router.push('/dashboard');
        // ============================================
    };

    const cycleTheme = () => {
        setTheme(prev => {
            if (prev === 'system') return 'light';
            if (prev === 'light') return 'dark';
            return 'system';
        });
    };

    const isDark = resolvedTheme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
            {/* Navigation */}
            <nav className={`border-b transition-colors ${isDark ? 'bg-[#0f0f14] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>eXpense</span>
                        </div>

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

            {/* Confirmation Content */}
            <div className="flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 min-h-[calc(100vh-5rem)]">
                <div className="w-full max-w-md text-center">
                    {error ? (
                        /* Error State */
                        <>
                            <div className="mb-8 flex justify-center">
                                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>

                            <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Authentication Failed
                            </h1>

                            <p className={`text-base mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {error}
                            </p>

                            <a
                                href="/signin"
                                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
                            >
                                Back to Sign In
                            </a>
                        </>
                    ) : (
                        /* Success State */
                        <>
                            {/* Success Animation */}
                            <div className="mb-8 flex justify-center">
                                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                                    {/* Animated rings */}
                                    <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isDark ? 'bg-green-500' : 'bg-green-600'}`}></div>
                                    <div className={`absolute inset-0 rounded-full animate-pulse ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}></div>

                                    {/* Checkmark */}
                                    <svg
                                        className="w-12 h-12 text-green-500 relative z-10 animate-[scale-in_0.5s_ease-out]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        style={{
                                            animation: 'scale-in 0.5s ease-out'
                                        }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                            style={{
                                                strokeDasharray: 20,
                                                strokeDashoffset: 20,
                                                animation: 'draw 0.5s ease-out 0.3s forwards'
                                            }}
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Sign in authorised
                            </h1>

                            <p className={`text-base mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Redirecting you to your dashboard...
                            </p>

                            {/* Progress Card */}
                            <div className={`rounded-2xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200 shadow-xl'}`}>
                                {/* Countdown */}
                                <div className="mb-4">
                                    <div className={`text-5xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                        {countdown}
                                    </div>
                                    <div className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        {countdown === 1 ? 'second' : 'seconds'}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#1a1a26]' : 'bg-gray-100'}`}>
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-100 ease-linear rounded-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Skip Button */}
                            <button
                                onClick={handleRedirect}
                                className={`mt-6 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Skip wait →
                            </button>
                        </>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
        </div>
    );
}