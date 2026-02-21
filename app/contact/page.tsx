'use client';

import { useState, useEffect } from 'react';

export default function Contact() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
    const [userEmail, setUserEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [contactError, setContactError] = useState('');
    const [contactSuccess, setContactSuccess] = useState(false);

    const BACKEND_URL = "http://localhost:3002";

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

    useEffect(() => {
        // Get user info from token
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/signin';
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserEmail(payload.email || 'user@example.com');
        } catch (e) {
            setUserEmail('user@example.com');
        }
    }, []);

    const handleSendMessage = async () => {
        setContactError('');
        setContactSuccess(false);

        // Validation
        if (!contactMessage.trim()) {
            setContactError('Please enter a message');
            return;
        }

        if (contactMessage.trim().length < 10) {
            setContactError('Message must be at least 10 characters');
            return;
        }

        setSendingMessage(true);

        try {
            const response = await fetch(`${BACKEND_URL}/api/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userEmail,
                    body: contactMessage.trim(),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to send message');
            }

            // Success
            setContactSuccess(true);
            setContactMessage('');

            // Clear success message after 5 seconds
            setTimeout(() => {
                setContactSuccess(false);
            }, 5000);
        } catch (error) {
            setContactError(error instanceof Error ? error.message : 'Failed to send message');
        } finally {
            setSendingMessage(false);
        }
    };

    const cycleTheme = () => {
        setTheme(prev => {
            if (prev === 'system') return 'light';
            if (prev === 'light') return 'dark';
            return 'system';
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        window.location.href = '/signin';
    };

    const isDark = resolvedTheme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
            {/* Desktop Header */}
            <header className={`hidden md:block border-b transition-colors ${isDark ? 'bg-[#0f0f14] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>eXpense</span>
                        </div>

                        <nav className="flex items-center gap-1">
                            <a href="/dashboard" className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#1a1a24]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Home</a>
                            <a href="/expenses" className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#1a1a24]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Expenses</a>
                            <a href="/ai" className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#1a1a24]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>AI</a>
                            <a href="/contact" className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white">Contact</a>
                        </nav>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={cycleTheme}
                                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'bg-[#1a1a24] text-gray-300 hover:bg-[#24242e]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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

                            <button
                                onClick={handleLogout}
                                className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'bg-[#1a1a24] text-red-400 hover:bg-red-500/10' : 'bg-gray-100 text-red-600 hover:bg-red-50'}`}
                                title="Logout"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>

                            <button
                                onClick={handleLogout}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#1a1a24]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Header */}
            <header className={`md:hidden border-b transition-colors ${isDark ? 'bg-[#0f0f14] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                <div className="px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>eXpense</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={cycleTheme}
                            className={`p-2 rounded-lg transition-all ${isDark ? 'bg-[#1a1a24] text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                        >
                            {theme === 'system' ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            ) : theme === 'light' ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={handleLogout}
                            className={`p-2 rounded-lg transition-all ${isDark ? 'bg-[#1a1a24] text-red-400 hover:bg-red-500/10' : 'bg-gray-100 text-red-600 hover:bg-red-50'}`}
                            title="Logout"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pb-20 md:pb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">📧</div>
                            <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Get in Touch
                            </h1>
                            <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Have a question, feedback, or need help? Send us a message and we'll get back to you soon.
                            </p>
                        </div>

                        <div className={`rounded-2xl p-8 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200 shadow-xl'}`}>
                            <div className="space-y-6">
                                {/* User Info Display */}
                                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1a26]' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Sending as
                                            </p>
                                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {userEmail}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                    >
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        value={contactMessage}
                                        onChange={(e) => setContactMessage(e.target.value)}
                                        placeholder="Tell us what's on your mind..."
                                        rows={8}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${isDark
                                            ? 'bg-[#1a1a26] border-[#2a2a35] text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                            }`}
                                        disabled={sendingMessage}
                                    />
                                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        {contactMessage.length} characters
                                    </p>
                                </div>

                                {/* Error Message */}
                                {contactError && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-500">{contactError}</p>
                                    </div>
                                )}

                                {/* Success Message */}
                                {contactSuccess && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-green-500">Message sent successfully! We'll get back to you soon.</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sendingMessage}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                                >
                                    {sendingMessage ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <div className={`rounded-xl p-6 border text-center ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Help Center
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Find answers to common questions
                                </p>
                            </div>

                            <div className={`rounded-xl p-6 border text-center ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    FAQ
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Quick answers to your questions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t transition-colors ${isDark ? 'bg-[#0f0f14] border-[#2a2a35]' : 'bg-white border-gray-200'} safe-area-inset-bottom`}>
                <div className="grid grid-cols-4 gap-0">
                    <a href="/dashboard" className={`flex flex-col items-center justify-center py-3 px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-xs mt-1 font-medium">Home</span>
                    </a>
                    <a href="/expenses" className={`flex flex-col items-center justify-center py-3 px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="text-xs mt-1 font-medium">Expenses</span>
                    </a>
                    <a href="/ai" className={`flex flex-col items-center justify-center py-3 px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-xs mt-1 font-medium">AI</span>
                    </a>
                    <a href="/contact" className="flex flex-col items-center justify-center py-3 px-2 text-blue-500">
                        <div className="scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-xs mt-1 font-medium">Contact</span>
                    </a>
                </div>
            </nav>
        </div>
    );
}