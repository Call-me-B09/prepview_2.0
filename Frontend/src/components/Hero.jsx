import React from 'react';
import { ArrowRight, Upload, Sparkles, User, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import TrueFocus from './TrueFocus';

export default function Hero({ currentUser, onNavigate }) {
  // Waveform heights for live voice animation
  const waves = [
    { height: 'h-4', delay: '0.1s' },
    { height: 'h-8', delay: '0.3s' },
    { height: 'h-12', delay: '0.5s' },
    { height: 'h-6', delay: '0.2s' },
    { height: 'h-10', delay: '0.4s' },
    { height: 'h-14', delay: '0.7s' },
    { height: 'h-8', delay: '0.3s' },
    { height: 'h-12', delay: '0.6s' },
    { height: 'h-5', delay: '0.1s' },
    { height: 'h-9', delay: '0.4s' },
    { height: 'h-3', delay: '0.2s' },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-24 overflow-hidden flex items-center justify-center grid-bg">
      {/* Background Glowing Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#E2E8F0]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#E5A9A9]/5 blur-[120px] pointer-events-none" />

      {/* Floating Particles (Soft glow dots) */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/5 w-2 h-2 rounded-full bg-[#E5A9A9]/30 blur-xs"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-[#E2E8F0]/25 blur-xs"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 20, 0],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-2/3 left-2/3 w-1.5 h-1.5 rounded-full bg-[#E2E8F0]/30 blur-xs"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Hero Content Left */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neumorphic-inset text-xs text-[#E5A9A9] font-mono font-semibold tracking-wider uppercase mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5A9A9]" />
              PrepView 2.0 Is Live
            </motion.div>

            {/* Title / Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-normal mb-8 w-full"
            >
              <TrueFocus
                sentence="Master Every Interview Before It Happens."
                manualMode={false}
                blurAmount={3}
                borderColor="#E5A9A9"
                glowColor="rgba(229, 169, 169, 0.4)"
                animationDuration={0.6}
                pauseBetweenAnimations={1.4}
              />
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-text-secondary font-sans font-normal leading-relaxed mb-8 max-w-lg"
            >
              Upload your resume, choose a role, and practice realistic AI-powered mock interviews with instant feedback.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => {
                  if (currentUser) {
                    onNavigate('dashboard');
                  } else {
                    onNavigate('login');
                  }
                }}
                className="px-8 py-4 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 shadow-xl transition-all duration-300 text-center flex items-center justify-center gap-3 group cursor-pointer"
              >
                Start Mock Interview
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* Hero Visual Right (Neumorphic Logo Showcase) */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            {/* Soft background glows */}
            <div className="absolute w-[350px] h-[350px] rounded-full bg-[#E5A9A9]/5 blur-[80px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center p-8"
            >
              {/* Outer Neumorphic Ring */}
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full neumorphic-flat flex items-center justify-center p-8 transition-transform duration-500 hover:scale-102">

                {/* Inner Inset Ring */}
                <div className="w-full h-full rounded-full neumorphic-inset flex items-center justify-center p-6">

                  {/* Center Raised Circle */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full rounded-full neumorphic-flat flex items-center justify-center relative border border-white/5 shadow-2xl group overflow-hidden"
                  >
                    {/* Glowing background inside the raised circle */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#E5A9A9]/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Scanning orbit decoration */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full border border-dashed border-[#E5A9A9]/20 pointer-events-none"
                    />

                    {/* Logo Image with rose-gold glow */}
                    <img
                      src="/images/logo.png"
                      alt="PrepView Premium Logo"
                      className="absolute top-[55.5%] left-[54.5%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 object-contain z-10 drop-shadow-[0_0_24px_rgba(229,169,169,0.35)] transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Clean reflection highlight */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                  </motion.div>

                </div>

              </div>

              {/* Floating Neumorphic Badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -left-4 glassmorphic-card px-4 py-2.5 rounded-full border border-swiss-grid-border flex items-center gap-2 shadow-xl"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-wide text-white uppercase">AI Engine Active</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -right-4 glassmorphic-card px-4 py-2.5 rounded-full border border-swiss-grid-border flex items-center gap-2 shadow-xl"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A9A9]" />
                <span className="text-[10px] font-mono font-bold tracking-wide text-white uppercase">PrepView 2.0</span>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
