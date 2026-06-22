import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ currentUser, onLogout, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#testimonials' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glassmorphic-navbar py-4'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo and Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            src="/images/logo.png"
            alt="PrepView Logo"
            className="w-14 h-14 object-contain translate-x-1.5 translate-y-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-1.5 group-hover:translate-y-1.5"
          />
          <span className="font-display font-bold text-2xl tracking-tight text-white">
            PrepView <span className="text-[#E5A9A9] font-medium">2.0</span>
          </span>
        </a>

        {/* Desktop Nav Links — only shown to logged-out visitors */}
        {!currentUser && (
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-sans font-medium text-text-secondary hover:text-white transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>
        )}

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-sm font-sans font-medium text-text-secondary hover:text-white transition-colors duration-200 px-3 py-2 cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('sessions')}
                className="text-sm font-sans font-medium text-text-secondary hover:text-white transition-colors duration-200 px-3 py-2 cursor-pointer"
              >
                Sessions
              </button>
              <button
                onClick={() => onNavigate('new-interview')}
                className="text-sm font-sans font-semibold text-white px-5 py-2.5 rounded-lg neumorphic-button hover:border-white hover:text-[#E5A9A9] flex items-center gap-2 group cursor-pointer"
              >
                New Interview
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={onLogout}
                className="text-sm font-sans font-medium text-[#E5A9A9] hover:text-[#E5A9A9]/80 transition-colors duration-200 px-4 py-2 cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="text-sm font-sans font-medium text-text-secondary hover:text-white transition-colors duration-200 px-4 py-2 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="text-sm font-sans font-semibold text-white px-5 py-2.5 rounded-lg neumorphic-button hover:border-white hover:text-[#E5A9A9] flex items-center gap-2 group cursor-pointer"
              >
                Start Interview
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-text-secondary hover:text-white hover:bg-surface rounded-lg transition-colors neumorphic-button cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-[#0A0A0A] border-b border-swiss-grid-border px-6 py-8 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            {/* Landing section links — hidden for logged-in users */}
            {!currentUser && (
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-sans font-medium text-text-secondary hover:text-white transition-colors duration-200 py-2 border-b border-swiss-grid-border"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4 mt-4 text-center">
              {currentUser ? (
                <>
                  <span className="text-base font-sans font-semibold text-white">
                    Hi, {currentUser.name}
                  </span>
                  <button
                    onClick={() => { onNavigate('dashboard'); setIsOpen(false); }}
                    className="w-full text-center text-base font-sans font-medium text-text-secondary hover:text-white py-3 rounded-lg border border-swiss-grid-border hover:bg-surface transition-colors cursor-pointer"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { onNavigate('sessions'); setIsOpen(false); }}
                    className="w-full text-center text-base font-sans font-medium text-text-secondary hover:text-white py-3 rounded-lg border border-swiss-grid-border hover:bg-surface transition-colors cursor-pointer"
                  >
                    Sessions
                  </button>
                  <button
                    onClick={() => { onNavigate('new-interview'); setIsOpen(false); }}
                    className="w-full text-center text-base font-sans font-bold text-slate-950 py-3 rounded-lg gradient-primary flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    New Interview
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-base font-sans font-medium text-[#E5A9A9] py-3 rounded-lg border border-swiss-grid-border hover:bg-surface transition-colors cursor-pointer"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onNavigate('login');
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-base font-sans font-medium text-text-secondary hover:text-white py-3 rounded-lg border border-swiss-grid-border hover:bg-surface transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('login');
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-base font-sans font-bold text-slate-950 py-3 rounded-lg gradient-primary flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    Start Interview
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
