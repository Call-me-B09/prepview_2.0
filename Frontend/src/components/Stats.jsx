import React from 'react';
import { Users, TrendingUp, Briefcase, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stats() {
  const stats = [
    {
      value: '10,000+',
      label: 'Mock Interviews',
      icon: Users,
      color: 'text-white',
      bg: 'bg-white/10',
    },
    {
      value: '95%',
      label: 'Confidence Improvement',
      icon: TrendingUp,
      color: 'text-[#E5A9A9]',
      bg: 'bg-[#E5A9A9]/10',
    },
    {
      value: '50+',
      label: 'Job Roles',
      icon: Briefcase,
      color: 'text-slate-300',
      bg: 'bg-slate-300/10',
    },
    {
      value: '24/7',
      label: 'AI Interviewer',
      icon: Clock,
      color: 'text-slate-400',
      bg: 'bg-slate-400/10',
    },
  ];

  return (
    <section className="py-20 relative z-10 bg-[#0A0A0A] border-t border-b border-swiss-grid-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="neumorphic-flat rounded-2xl p-8 flex flex-col items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/10"
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-xl ${stat.bg} border border-white/5 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>

                <div className="flex flex-col gap-1">
                  {/* Stat Value */}
                  <span className="text-4xl md:text-5xl font-display font-black tracking-tight text-white">
                    {stat.value}
                  </span>
                  {/* Stat Label */}
                  <span className="text-sm font-sans font-medium text-text-secondary">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
