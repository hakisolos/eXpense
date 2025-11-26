'use client';

import { useState, useEffect } from 'react';

export default function Expenses() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
    const [userEmail, setUserEmail] = useState('');
    const [expenseData, setExpenseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Add Expense Form State
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [newExpense, setNewExpense] = useState({
        desc: '',
        category: 'Misc',
        amount: ''
    });
    const [addingExpense, setAddingExpense] = useState(false);
    const [expenseError, setExpenseError] = useState('');

    const BACKEND_URL = 'http://172.20.10.4:4000';
    const categories = ['Misc', 'food', 'utilities', 'personal', 'subscriptions'];

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
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async () => {
        setExpenseError('');

        // Validation
        if (!newExpense.desc || !newExpense.amount) {
            setExpenseError('Please fill in all fields');
            return;
        }

        if (isNaN(Number(newExpense.amount)) || Number(newExpense.amount) <= 0) {
            setExpenseError('Please enter a valid amount');
            return;
        }

        setAddingExpense(true);

        try {
            const response = await fetch(`${BACKEND_URL}/api/addExpense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userEmail,
                    desc: newExpense.desc,
                    category: newExpense.category,
                    amount: Number(newExpense.amount),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add expense');
            }

            // Reset form
            setNewExpense({ desc: '', category: 'Misc', amount: '' });
            setShowAddExpense(false);

            // Refresh data
            const token = localStorage.getItem('auth_token');
            if (token) {
                fetchUserData(token);
            }

            alert('Expense added successfully!');
        } catch (error) {
            setExpenseError(error instanceof Error ? error.message : 'Failed to add expense');
        } finally {
            setAddingExpense(false);
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
                            <a href="/expenses" className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white">Expenses</a>
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
                    <div className="flex items-center justify-between mb-6">
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Expenses</h1>
                        <button
                            onClick={() => setShowAddExpense(!showAddExpense)}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Expense
                        </button>
                    </div>

                    {/* Add Expense Form */}
                    {showAddExpense && (
                        <div className={`rounded-xl p-6 border mb-6 ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Expense</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={newExpense.desc}
                                        onChange={(e) => setNewExpense({ ...newExpense, desc: e.target.value })}
                                        placeholder="e.g., Grocery shopping"
                                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                            ? 'bg-[#1a1a26] border-[#2a2a35] text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Category
                                    </label>
                                    <select
                                        value={newExpense.category}
                                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                            ? 'bg-[#1a1a26] border-[#2a2a35] text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Amount (₦)
                                    </label>
                                    <input
                                        type="number"
                                        value={newExpense.amount}
                                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        placeholder="0.00"
                                        step="0.01"
                                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                            ? 'bg-[#1a1a26] border-[#2a2a35] text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                            }`}
                                    />
                                </div>

                                {expenseError && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-500">{expenseError}</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddExpense}
                                        disabled={addingExpense}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addingExpense ? 'Adding...' : 'Add Expense'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddExpense(false);
                                            setExpenseError('');
                                            setNewExpense({ desc: '', category: 'Misc', amount: '' });
                                        }}
                                        className={`px-6 py-3 rounded-lg font-semibold border transition-all ${isDark
                                            ? 'border-[#2a2a35] text-gray-300 hover:bg-[#1a1a26]'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Expense Stats */}
                    {loading ? (
                        <div className={`rounded-xl p-8 border text-center ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                            <div className="animate-pulse">
                                <div className={`h-8 rounded w-1/3 mx-auto mb-4 ${isDark ? 'bg-[#1a1a26]' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 rounded w-1/2 mx-auto ${isDark ? 'bg-[#1a1a26]' : 'bg-gray-200'}`}></div>
                            </div>
                        </div>
                    ) : expenseData ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-3 rounded-lg ${isDark ? 'bg-[#1a1a26]' : 'bg-blue-50'}`}>
                                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Amount</p>
                                            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                ₦{expenseData.totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-3 rounded-lg ${isDark ? 'bg-[#1a1a26]' : 'bg-purple-50'}`}>
                                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Expenses</p>
                                            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {expenseData.totalCount}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Category Breakdown
                                </h2>

                                {Object.keys(expenseData.categoryBreakdown).length > 0 ? (
                                    <div className="space-y-3">
                                        {Object.entries(expenseData.categoryBreakdown).map(([category, amount]: [string, any]) => (
                                            <div key={category} className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-[#1a1a26]' : 'bg-gray-50'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#14141f]' : 'bg-white'}`}>
                                                        <span className="text-lg">
                                                            {category === 'food' ? '🍔' :
                                                                category === 'utilities' ? '⚡' :
                                                                    category === 'personal' ? '👤' :
                                                                        category === 'subscriptions' ? '📱' : '📦'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                                        </div>
                                                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                            {((amount / expenseData.totalAmount) * 100).toFixed(1)}% of total
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    ₦{Number(amount).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        No expenses yet. Add your first expense above!
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={`rounded-xl p-8 border text-center ${isDark ? 'bg-[#14141f] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No expense data available</p>
                        </div>
                    )}
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
                    <a href="/expenses" className="flex flex-col items-center justify-center py-3 px-2 text-blue-500">
                        <div className="scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
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