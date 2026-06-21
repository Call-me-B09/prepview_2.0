import React, { useState } from 'react';
import { User, Mail, Lock, ArrowLeft, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login({ onClose, onLoginSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Switch tabs cleanly
  const handleTabSwitch = (tab) => {
    setIsLoginTab(tab === 'login');
    setError('');
    setSuccess('');
  };

  // Signup Flow (Backend DB_service + local credentials storage)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Input Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const mockUid = `usr_${Date.now()}`;
    const dbUrl = import.meta.env.VITE_DB_SERVICE_URL || 'http://localhost:5000';

    try {
      // 1. Persist the user (uid and email) to DB_service backend
      const response = await fetch(`${dbUrl}/saveUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: mockUid,
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register user record on the database.');
      }

      // 2. Save credentials client-side for password check mock authentication
      const savedUsersRaw = localStorage.getItem('prepview_mock_users');
      const savedUsers = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};
      
      if (savedUsers[email.toLowerCase()]) {
        setError('An account with this email already exists.');
        setLoading(false);
        return;
      }

      savedUsers[email.toLowerCase()] = {
        name,
        email: email.toLowerCase(),
        password,
        uid: mockUid,
      };
      
      localStorage.setItem('prepview_mock_users', JSON.stringify(savedUsers));

      setSuccess('Account created successfully! Please log in now.');
      setIsLoginTab(true);
      // Clean up signup values
      setName('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError('Connection failed. Make sure DB_service backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Login Flow (local check + backend query)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const dbUrl = import.meta.env.VITE_DB_SERVICE_URL || 'http://localhost:5000';

    try {
      // 1. Validate credentials locally
      const savedUsersRaw = localStorage.getItem('prepview_mock_users');
      const savedUsers = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};
      const matchedUser = savedUsers[email.toLowerCase()];

      if (!matchedUser || matchedUser.password !== password) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      // 2. Query DB_service backend to verify record exists
      const response = await fetch(`${dbUrl}/getUser?uid=${matchedUser.uid}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('User profile not found in database service.');
        } else {
          setError('Failed to fetch user profile from database.');
        }
        setLoading(false);
        return;
      }

      const dbUser = await response.json();
      
      // 3. Save session in localStorage and update state
      const sessionData = {
        name: matchedUser.name,
        email: matchedUser.email,
        uid: dbUser.uid,
      };

      localStorage.setItem('prepview_current_user', JSON.stringify(sessionData));
      onLoginSuccess(sessionData);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Connection failed. Make sure DB_service backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 px-6 grid-bg bg-[#0A0A0A] overflow-hidden">
      {/* Background Glowing Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#E2E8F0]/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#E5A9A9]/3 blur-[120px] pointer-events-none" />

      {/* Structural layout lines: Swiss Style */}
      <div className="absolute left-[8%] right-[8%] top-0 bottom-0 border-l border-r border-swiss-grid-border/30 pointer-events-none z-0 hidden lg:block" />

      {/* Back button */}
      <button 
        onClick={onClose}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-text-secondary hover:text-white transition-colors duration-200 uppercase group z-10"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to Home
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 glassmorphic-card rounded-3xl p-8 md:p-10 shadow-2xl border border-swiss-grid-border"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 mb-3">
            <img 
              src="/images/logo.png" 
              alt="PrepView Logo" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(229,169,169,0.3)]" 
            />
            <span className="font-display font-black text-xl tracking-tight text-white">
              PrepView <span className="text-[#E5A9A9] font-medium">2.0</span>
            </span>
          </div>
          <p className="text-xs text-text-secondary font-mono tracking-wide uppercase">
            {isLoginTab ? 'Access your dashboard' : 'Join candidate system'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1.5 rounded-xl neumorphic-inset mb-8 relative">
          <button
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase transition-all duration-300 relative z-10 ${
              isLoginTab ? 'text-slate-950 font-extrabold' : 'text-text-secondary hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase transition-all duration-300 relative z-10 ${
              !isLoginTab ? 'text-slate-950 font-extrabold' : 'text-text-secondary hover:text-white'
            }`}
          >
            Create Account
          </button>
          
          {/* Active Tab sliding overlay background */}
          <motion.div
            layoutId="activeTabGlow"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="absolute top-1.5 bottom-1.5 left-1.5 rounded-lg gradient-primary"
            style={{
              width: 'calc(50% - 12px)',
              x: isLoginTab ? 0 : '100%',
              marginLeft: isLoginTab ? '0px' : '18px'
            }}
          />
        </div>

        {/* Status Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-start gap-3"
            >
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 flex items-start gap-3"
            >
              <CheckCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forms */}
        <form onSubmit={isLoginTab ? handleLogin : handleSignUp} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLoginTab && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-text-secondary pl-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary/50" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-text-secondary/40 font-sans focus:outline-hidden focus:border-[#E5A9A9]/50 transition-colors neumorphic-inset"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-text-secondary pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-text-secondary/40 font-sans focus:outline-hidden focus:border-[#E5A9A9]/50 transition-colors neumorphic-inset"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-text-secondary pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-text-secondary/40 font-sans focus:outline-hidden focus:border-[#E5A9A9]/50 transition-colors neumorphic-inset"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isLoginTab && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-text-secondary pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary/50" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-text-secondary/40 font-sans focus:outline-hidden focus:border-[#E5A9A9]/50 transition-colors neumorphic-inset"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLoginTab ? 'Sign In' : 'Create Account'}</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
