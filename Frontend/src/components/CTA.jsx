import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section id="start-interview" className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Intense Glowing Circles behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-white/10 to-[#E5A9A9]/10 blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="neumorphic-flat rounded-3xl p-12 md:p-20 border border-swiss-grid-border text-center relative overflow-hidden flex flex-col items-center">
          
          {/* Inner radial gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#181818]/80 to-transparent pointer-events-none" />

          {/* Micro decoration */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-8 relative z-10"
          >
            <Sparkles className="w-5 h-5 text-[#E5A9A9]" />
          </motion.div>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight max-w-3xl mb-6 relative z-10">
            Your Next Interview <br />
            Shouldn’t Be Your <span className="text-gradient-accent">First Practice.</span>
          </h2>

          {/* Subheading */}
          <p className="text-sm font-sans font-medium text-text-secondary max-w-xl mb-10 leading-relaxed relative z-10">
            Join thousands of developers, designers, and product leaders who use PrepView 2.0 to land their dream positions. Set up your first mock round in under two minutes.
          </p>

          {/* Button CTA */}
          <button className="px-10 py-5 rounded-2xl font-sans font-bold text-sm tracking-wider uppercase text-slate-950 gradient-primary hover:opacity-90 shadow-2xl transition-all duration-300 flex items-center gap-3 group relative z-10">
            Start Practicing Now
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
