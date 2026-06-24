import React, { useState } from 'react';
import { User, Mail, Lock, ArrowLeft, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  auth, 
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile
} from '../firebase.js';

export default function Login({ onClose, onLoginSuccess, onNavigate }) {
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

  // Signup Flow (Firebase Auth + Backend DB_service)
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
    const dbUrl = import.meta.env.VITE_DB_SERVICE_URL || 'http://localhost:5000/db';

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Set display name in Firebase
      await updateProfile(user, { displayName: name });

      // 3. Persist the user (uid and email) to DB_service backend
      const response = await fetch(`${dbUrl}/saveUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register user record on the database.');
      }

      setSuccess('Account created successfully! Please log in now.');
      setIsLoginTab(true);
      // Clean up signup values
      setName('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Login Flow (Firebase Auth + backend query)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const dbUrl = import.meta.env.VITE_DB_SERVICE_URL || 'http://localhost:5000/db';

    try {
      // 1. Validate credentials with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Query DB_service backend to verify record exists
      let response = await fetch(`${dbUrl}/getUser?uid=${user.uid}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // If not found in DB but exists in Firebase Auth, register on DB service to be safe
          console.warn("User exists in Auth but not in DB service. Registering user on the fly...");
          const saveRes = await fetch(`${dbUrl}/saveUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid, email: user.email })
          });
          if (!saveRes.ok) {
            throw new Error('Failed to register user profile on database.');
          }
          response = await fetch(`${dbUrl}/getUser?uid=${user.uid}`);
        } else {
          throw new Error('Failed to fetch user profile from database.');
        }
      }

      const dbUser = await response.json();
      
      // 3. Save session in localStorage and update state
      const sessionData = {
        name: user.displayName || email.split('@')[0],
        email: user.email,
        uid: user.uid,
      };

      localStorage.setItem('prepview_current_user', JSON.stringify(sessionData));
      onLoginSuccess(sessionData);
      if (onNavigate) {
        onNavigate('dashboard');
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Flow
  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const dbUrl = import.meta.env.VITE_DB_SERVICE_URL || 'http://localhost:5000/db';

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if user exists in DB_service backend
      let response = await fetch(`${dbUrl}/getUser?uid=${user.uid}`);
      if (!response.ok) {
        if (response.status === 404) {
          // New Google User: save user record in DB service
          console.log("New Google user. Registering on DB service...");
          const saveRes = await fetch(`${dbUrl}/saveUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid, email: user.email })
          });
          if (!saveRes.ok) {
            throw new Error('Failed to register Google user profile on database.');
          }
          response = await fetch(`${dbUrl}/getUser?uid=${user.uid}`);
        } else {
          throw new Error('Failed to verify user profile with database.');
        }
      }

      const dbUser = await response.json();

      const sessionData = {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        uid: user.uid,
      };

      localStorage.setItem('prepview_current_user', JSON.stringify(sessionData));
      onLoginSuccess(sessionData);
      if (onNavigate) {
        onNavigate('dashboard');
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google Sign-In failed. Please try again.');
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

        {/* Divider */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono text-text-secondary/70 uppercase tracking-widest">or continue with</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          type="button"
          className="w-full py-3.5 rounded-xl border border-white/8 hover:border-white/15 text-xs font-mono font-bold tracking-wider text-text-secondary hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-md hover:bg-white/1.5 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {/* Google Icon SVG */}
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Google Sign In</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
