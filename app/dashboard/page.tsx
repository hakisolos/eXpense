'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
    const [userEmail, setUserEmail] = useState('');
    const [expenseData, setExpenseData] = useState<any>(null);
    const [allExpenses, setAllExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = "https://expense-backend-2bkm.onrender.com";

    // Calculate analytics from expenses
    const calculateAnalytics = (expenses: any[]) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // This week's expenses
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const weekExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.createdAt);
            return expDate >= startOfWeek;
        });

        // This month's expenses
        const monthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.createdAt);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        });

        // Last month's expenses
        const lastMonth = new Date(currentYear, currentMonth - 1, 1);
        const lastMonthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.createdAt);
            return expDate.getMonth() === lastMonth.getMonth() && expDate.getFullYear() === lastMonth.getFullYear();
        });

        // Daily expenses for last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            const dayExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.createdAt);
                return expDate >= date && expDate < nextDay;
            });

            const total = dayExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

            last7Days.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                amount: total
            });
        }

        // Monthly expenses for last 6 months
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const monthExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.createdAt);
                return expDate.getMonth() === date.getMonth() && expDate.getFullYear() === date.getFullYear();
            });

            const total = monthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

            last6Months.push({
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                amount: total
            });
        }

        const weekTotal = weekExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
        const monthTotal = monthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
        const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

        const monthChange = lastMonthTotal > 0
            ? ((monthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
            : 0;

        return {
            weekTotal,
            monthTotal,
            monthChange,
            last7Days,
            last6Months,
            avgDaily: (monthTotal / new Date(currentYear, currentMonth + 1, 0).getDate()).toFixed(2)
        };
    };

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
            fetchUserData(token);
        } catch (e) {
            setUserEmail('user@example.com');
            setLoading(false);
        }
    }, []);

    const fetchUserData = async (token: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setExpenseData(data.expenseMeta);
            setAllExpenses(data.expenses || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
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
                            <a href="/dashboard" className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white">Home</a>
                            <a href="/expenses" className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#1a1a24]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Expenses</a>
                            <a href="/ai" className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#1a1a24]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>AI</a>
                            <a href="/contact" className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-[#1a1a24]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Contact</a>
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
                    <div className="mb-6">
                        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Welcome back!
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {userEmail}
                        </p>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`rounded-xl p-6 border animate-pulse ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                        <div className={`h-4 rounded w-1/2 mb-4 ${isDark ? 'bg-[#1a1a26]' : 'bg-gray-200'}`}></div>
                                        <div className={`h-8 rounded w-2/3 ${isDark ? 'bg-[#1a1a26]' : 'bg-gray-200'}`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : expenseData ? (
                        <>
                            {(() => {
                                const analytics = calculateAnalytics(allExpenses);
                                return (
                                    <>
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                            <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Expenses</span>
                                                    <div className={`p-2 rounded-lg ${isDark ? 'bg-[#1a1a26]' : 'bg-blue-50'}`}>
                                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    ₦{expenseData.totalAmount.toFixed(2)}
                                                </div>
                                                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    All time
                                                </p>
                                            </div>

                                            <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>This Month</span>
                                                    <div className={`p-2 rounded-lg ${isDark ? 'bg-[#1a1a26]' : 'bg-purple-50'}`}>
                                                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    ₦{analytics.monthTotal.toFixed(2)}
                                                </div>
                                                <p className={`text-sm mt-1 ${Number(analytics.monthChange) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                    {Number(analytics.monthChange) > 0 ? '↑' : '↓'} {Math.abs(Number(analytics.monthChange))}% vs last month
                                                </p>
                                            </div>

                                            <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>This Week</span>
                                                    <div className={`p-2 rounded-lg ${isDark ? 'bg-[#1a1a26]' : 'bg-green-50'}`}>
                                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    ₦{analytics.weekTotal.toFixed(2)}
                                                </div>
                                                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    Last 7 days
                                                </p>
                                            </div>

                                            <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Daily Average</span>
                                                    <div className={`p-2 rounded-lg ${isDark ? 'bg-[#1a1a26]' : 'bg-orange-50'}`}>
                                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    ₦{analytics.avgDaily}
                                                </div>
                                                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    This month
                                                </p>
                                            </div>
                                        </div>

                                        {/* Charts Row */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                            {/* Weekly Spending Chart */}
                                            <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    Weekly Spending
                                                </h2>
                                                <div className="h-64 flex items-end justify-between gap-2">
                                                    {analytics.last7Days.map((day, i) => {
                                                        const maxAmount = Math.max(...analytics.last7Days.map(d => d.amount), 1);
                                                        const height = (day.amount / maxAmount) * 100;
                                                        return (
                                                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                                <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                                                                    <div
                                                                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:opacity-80 cursor-pointer relative group"
                                                                        style={{ height: `${height}%`, minHeight: day.amount > 0 ? '8px' : '0' }}
                                                                        title={`${day.amount.toFixed(2)}`}
                                                                    >
                                                                        <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'bg-[#1a1a26] text-white' : 'bg-gray-800 text-white'}`}>
                                                                            ₦{day.amount.toFixed(2)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                    {day.day}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Monthly Trend Chart */}
                                            <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    Monthly Trend
                                                </h2>
                                                <div className="h-64 flex items-end justify-between gap-3">
                                                    {analytics.last6Months.map((month, i) => {
                                                        const maxAmount = Math.max(...analytics.last6Months.map(m => m.amount), 1);
                                                        const height = (month.amount / maxAmount) * 100;
                                                        return (
                                                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                                <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                                                                    <div
                                                                        className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-purple-400 transition-all hover:opacity-80 cursor-pointer relative group"
                                                                        style={{ height: `${height}%`, minHeight: month.amount > 0 ? '8px' : '0' }}
                                                                        title={`${month.amount.toFixed(2)}`}
                                                                    >
                                                                        <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'bg-[#1a1a26] text-white' : 'bg-gray-800 text-white'}`}>
                                                                            ₦{month.amount.toFixed(2)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                    {month.month}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Breakdown with Progress Bars */}
                                        {Object.keys(expenseData.categoryBreakdown).length > 0 && (
                                            <div className={`rounded-xl p-6 border mb-8 ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    Category Breakdown
                                                </h2>
                                                <div className="space-y-4">
                                                    {Object.entries(expenseData.categoryBreakdown)
                                                        .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                                                        .map(([category, amount]: [string, any]) => {
                                                            const percentage = (amount / expenseData.totalAmount) * 100;
                                                            return (
                                                                <div key={category}>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-lg">
                                                                                {category === 'food' ? '🍔' :
                                                                                    category === 'utilities' ? '⚡' :
                                                                                        category === 'personal' ? '👤' :
                                                                                            category === 'subscriptions' ? '📱' : '📦'}
                                                                            </span>
                                                                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                {percentage.toFixed(1)}%
                                                                            </span>
                                                                            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                                ₦{Number(amount).toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#1a1a26]' : 'bg-gray-100'}`}>
                                                                        <div
                                                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                                                            style={{ width: `${percentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Quick Action */}
                                        <div className={`rounded-xl p-6 border text-center ${isDark ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'}`}>
                                            <div className={`text-4xl mb-3`}>💡</div>
                                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Ready to add an expense?
                                            </h3>
                                            <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Track your spending and let AI help you save more
                                            </p>
                                            <a
                                                href="/expenses"
                                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
                                            >
                                                Add Expense Now
                                            </a>
                                        </div>
                                    </>
                                );
                            })()}
                        </>
                    ) : (
                        <div className={`rounded-xl p-8 border text-center ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                No expenses yet
                            </h3>
                            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Start tracking your expenses to see your financial insights
                            </p>
                            <a
                                href="/expenses"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                            >
                                Add Your First Expense
                            </a>
                        </div>
                    )}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t transition-colors ${isDark ? 'bg-[#0f0f14] border-[#2a2a35]' : 'bg-white border-gray-200'} safe-area-inset-bottom`}>
                <div className="grid grid-cols-4 gap-0">
                    <a href="/dashboard" className="flex flex-col items-center justify-center py-3 px-2 text-blue-500">
                        <div className="scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
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
                    <a href="/contact" className={`flex flex-col items-center justify-center py-3 px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs mt-1 font-medium">Contact</span>
                    </a>
                </div>
            </nav>
        </div>
    );
}