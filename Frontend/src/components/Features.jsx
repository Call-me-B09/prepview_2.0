import React from 'react';
import { Mic, FileText, Cpu, BarChart3, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      icon: Mic,
      title: 'Voice-Based Interviews',
      description: 'Speak naturally during your mock interviews and receive real-time speech-to-text transcriptions with lag-free latency.',
      color: 'text-white',
      borderColor: 'hover:border-white/40',
      bgGlow: 'from-white/5 to-transparent',
    },
    {
      icon: FileText,
      title: 'Resume-Aware Questions',
      description: 'Our AI parses your resume to craft highly tailored behavioral and technical questions, simulating real-life targeted screenings.',
      color: 'text-[#E5A9A9]',
      borderColor: 'hover:border-[#E5A9A9]/40',
      bgGlow: 'from-[#E5A9A9]/5 to-transparent',
    },
    {
      icon: Cpu,
      title: 'Adaptive AI Interviewer',
      description: 'Experience a dynamic interview flow where the AI listens to your previous answer to ask relevant, custom follow-up questions.',
      color: 'text-slate-200',
      borderColor: 'hover:border-slate-200/40',
      bgGlow: 'from-slate-200/5 to-transparent',
    },
    {
      icon: BarChart3,
      title: 'Detailed Evaluation',
      description: 'Get deep breakdowns scoring your performance on technical competence, communication clarity, confidence level, and pace.',
      color: 'text-slate-300',
      borderColor: 'hover:border-slate-300/40',
      bgGlow: 'from-slate-300/5 to-transparent',
    },
    {
      icon: Target,
      title: 'Role-Specific Practice',
      description: 'Practice targeted question banks curated specifically for Software Engineering, Product, Data Science, HR, Finance, and more.',
      color: 'text-[#BAE6FD]',
      borderColor: 'hover:border-[#BAE6FD]/40',
      bgGlow: 'from-[#BAE6FD]/5 to-transparent',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visualize your progression over multiple sessions, compare interview readiness scores, and map improvements on a historical dashboard.',
      color: 'text-slate-400',
      borderColor: 'hover:border-slate-400/40',
      bgGlow: 'from-slate-400/5 to-transparent',
    },
  ];

  return (
    <section id="features" className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Swiss Grid Section Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-24">
          <div className="lg:col-span-8">
            <span className="font-mono text-xs text-[#E5A9A9] uppercase font-bold tracking-widest block mb-4">
              Advanced Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-none">
              Built for high-performance <br />
              career growth.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm font-sans font-medium text-text-secondary leading-relaxed">
              Explore how PrepView 2.0 leverages state-of-the-art voice processing and intelligence engines to build a world-class simulator.
            </p>
          </div>
        </div>

        {/* Feature Grid: Swiss-style 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`neumorphic-flat neumorphic-flat-hover rounded-2xl p-8 relative overflow-hidden border border-swiss-grid-border group ${feature.borderColor}`}
              >
                {/* Background Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10 flex gap-6 items-start">
                  {/* Feature Icon */}
                  <div className="w-12 h-12 rounded-xl bg-elevated border border-swiss-grid-border flex items-center justify-center shrink-0 shadow-inner">
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>

                  {/* Feature Description */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-display font-bold text-white group-hover:text-[#E5A9A9] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm font-sans text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
