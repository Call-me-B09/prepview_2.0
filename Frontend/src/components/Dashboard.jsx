import React, { useEffect, useState } from 'react';
import { Mic, History, ArrowRight, Sparkles, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ currentUser, onNavigate }) {
  const [sessionStats, setSessionStats] = useState({ total: 0, completed: 0, avgScore: null });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser?.uid) return;
      try {
        const dbUrl = import.meta.env.VITE_DB_SERVICE_URL || 'http://localhost:5000/db';
        const res = await fetch(`${dbUrl}/getSessions/${currentUser.uid}`);
        if (res.ok) {
          const sessions = await res.json();
          const completed = sessions.filter(s => s.status === 'completed');
          const scores = completed.filter(s => s.overallScore != null).map(s => s.overallScore);
          const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
          setSessionStats({ total: sessions.length, completed: completed.length, avgScore: avg });
        }
      } catch (err) {
        // silently fail – stats are supplementary
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [currentUser]);

  const firstName = currentUser?.name?.split(' ')[0] || 'there';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans overflow-x-hidden relative grid-bg">
      {/* Ambient glowing meshes */}
      <div className="absolute top-[10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#E5A9A9]/4 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/2 blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#E5A9A9]/2 blur-[160px] pointer-events-none z-0" />

      {/* Swiss grid lines */}
      <div className="absolute left-[8%] right-[8%] top-0 bottom-0 border-l border-r border-white/5 pointer-events-none z-0 hidden lg:block" />

      <main className="flex-grow relative z-10 flex flex-col items-center justify-center px-6 pt-28 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl mx-auto"
        >
          {/* Greeting */}
          <motion.div variants={itemVariants} className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full neumorphic-inset text-xs text-[#E5A9A9] font-mono font-semibold tracking-widest uppercase mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5A9A9]" />
              Welcome Back
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-tight mb-4">
              Hello,{' '}
              <span className="text-[#E5A9A9] inline-flex items-center gap-3">
                {firstName}
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 250 }}
                >
                  <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#E5A9A9]/70" />
                </motion.span>
              </span>
            </h1>
            <p className="text-text-secondary text-lg font-sans font-normal max-w-xl mx-auto leading-relaxed">
              What would you like to do today? Pick an option below to get started.
            </p>
          </motion.div>

          {/* Stats row */}
          {!loadingStats && sessionStats.total > 0 && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-6 mb-12 flex-wrap"
            >
              {[
                { label: 'Total Sessions', value: sessionStats.total, icon: History },
                { label: 'Completed', value: sessionStats.completed, icon: CheckCircle2 },
                ...(sessionStats.avgScore !== null
                  ? [{ label: 'Avg Score', value: `${sessionStats.avgScore}/10`, icon: TrendingUp }]
                  : []),
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="glassmorphic-card rounded-2xl px-6 py-4 border border-white/8 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl neumorphic-flat flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-[#E5A9A9]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-text-secondary">{label}</p>
                    <p className="text-lg font-display font-black text-white">{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Main cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Start Interview Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="group relative glassmorphic-card rounded-3xl p-8 border border-white/8 cursor-pointer overflow-hidden"
              onClick={() => onNavigate('new-interview')}
              id="start-interview-card"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E5A9A9]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
              
              {/* Top badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Mic className="w-8 h-8 text-slate-950" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#E5A9A9] bg-[#E5A9A9]/10 px-3 py-1.5 rounded-full border border-[#E5A9A9]/20">
                  New
                </span>
              </div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight mb-3">
                Start Interview
              </h2>
              <p className="text-text-secondary font-sans text-sm leading-relaxed mb-8">
                Upload your resume, choose a target role, and begin a fully AI-powered mock interview session with real-time voice interaction and instant feedback.
              </p>

              {/* Features list */}
              <ul className="space-y-2 mb-8">
                {['Voice-based AI interview', 'Resume-tailored questions', 'Instant score & feedback'].map(feat => (
                  <li key={feat} className="flex items-center gap-2.5 text-xs text-text-secondary font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5A9A9] shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className="w-full py-4 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 text-center flex items-center justify-center gap-2 group/btn cursor-pointer shadow-xl"
              >
                <span>Begin Session</span>
                <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </button>
            </motion.div>

            {/* Previous Sessions Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="group relative glassmorphic-card rounded-3xl p-8 border border-white/8 cursor-pointer overflow-hidden"
              onClick={() => onNavigate('sessions')}
              id="previous-sessions-card"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
              
              {/* Top badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl neumorphic-flat flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border border-white/10">
                  <History className="w-8 h-8 text-white" />
                </div>
                {!loadingStats && sessionStats.total > 0 && (
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white bg-white/8 px-3 py-1.5 rounded-full border border-white/10">
                    {sessionStats.total} {sessionStats.total === 1 ? 'Session' : 'Sessions'}
                  </span>
                )}
              </div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight mb-3">
                Past Sessions
              </h2>
              <p className="text-text-secondary font-sans text-sm leading-relaxed mb-8">
                Review your previous mock interview sessions, revisit AI-generated feedback, analyse your scores, and track your improvement over time.
              </p>

              {/* Features list */}
              <ul className="space-y-2 mb-8">
                {['Detailed session breakdown', 'Per-question scores & feedback', 'Progress tracking over time'].map(feat => (
                  <li key={feat} className="flex items-center gap-2.5 text-xs text-text-secondary font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className="w-full py-4 rounded-xl font-sans font-bold text-white neumorphic-button hover:border-white hover:text-[#E5A9A9] transition-all duration-300 text-center flex items-center justify-center gap-2 group/btn cursor-pointer"
              >
                <Clock className="w-4.5 h-4.5" />
                <span>View History</span>
                <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* Bottom hint */}
          <motion.p
            variants={itemVariants}
            className="text-center text-[11px] font-mono text-text-secondary/50 tracking-wider uppercase mt-10"
          >
            PrepView 2.0 &mdash; AI-Powered Interview Preparation
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
