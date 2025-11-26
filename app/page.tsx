'use client';

import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check system preference
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

  const handleGetStarted = () => {
    alert('Redirecting to signup...');
    redirect("/signup")
  };

  const handleContact = () => {
    alert('Opening contact form...');
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f] text-gray-300' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b transition-colors ${isDark ? 'bg-[#0f0f14] border-[#2a2a35]' : 'bg-white border-gray-200'}`}>
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
              <button className={`hidden sm:inline-block px-8 py-3 rounded-lg font-semibold border transition-all ${isDark ? 'bg-transparent text-gray-300 border-[#404050] hover:bg-[#1a1a24] hover:border-[#505060]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center">
          <div className={`inline-block mb-6 px-4 py-2 rounded-lg border ${isDark ? 'bg-blue-950 border-blue-900' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <svg className="inline w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI-Powered Expense Management
            </p>
          </div>

          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Smart Expense Tracking with AI
          </h1>

          <p className={`text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Automatically categorize, analyze, and optimize your spending. Let AI do the heavy lifting while you focus on what matters.
          </p>

          <div className="flex gap-5 justify-center flex-wrap mb-16">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all text-base shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={handleContact}
              className={`px-8 py-3 rounded-lg font-semibold border transition-all ${isDark ? 'bg-transparent text-gray-300 border-[#404050] hover:bg-[#1a1a24] hover:border-[#505060]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl sm:text-5xl font-bold text-center mb-16 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                ),
                title: 'AI Categorization',
                description: 'Automatically categorize expenses with intelligent AI that learns your spending patterns.'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                ),
                title: 'Advanced Analytics',
                description: 'Get deep insights into your spending habits with beautiful, interactive dashboards.'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                ),
                title: 'Bank-Level Security',
                description: 'Your financial data is encrypted and protected with enterprise-grade security.'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                ),
                title: 'Mobile First',
                description: 'Track expenses on the go with our beautiful, responsive mobile experience.'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ),
                title: 'Real-Time Sync',
                description: 'Sync across all your devices instantly. Never miss a transaction.'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                ),
                title: 'Smart Insights',
                description: 'AI-powered recommendations to help you save more and spend smarter.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 border transition-all hover:scale-105 ${isDark ? 'bg-[#14141f] border-[#2a2a35] hover:border-[#404050] hover:bg-[#1a1a26]' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-[#1a1a26]' : 'bg-blue-50'}`}>
                  <svg className={`w-6 h-6 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Ready to Transform Your Finances?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join thousands of users who are already saving money with AI-powered expense tracking.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all text-lg shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-10 px-4 text-center ${isDark ? 'bg-[#0f0f14] border-[#2a2a35] text-gray-500' : 'bg-white border-gray-200 text-gray-600'}`}>
        <div className="max-w-7xl mx-auto">
          <p>&copy; 2025 eXpense. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className={`transition ${isDark ? 'hover:text-gray-400' : 'hover:text-gray-900'}`}>Privacy</a>
            <a href="#" className={`transition ${isDark ? 'hover:text-gray-400' : 'hover:text-gray-900'}`}>Terms</a>
            <a href="#" className={`transition ${isDark ? 'hover:text-gray-400' : 'hover:text-gray-900'}`}>Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}