import React from 'react';
import { Upload, Target, BrainCircuit, Mic, FileCheck2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload Resume',
      desc: 'Import your PDF resume to load candidate background context.',
      icon: Upload,
      color: 'text-white',
      bg: 'bg-white/10',
    },
    {
      num: '02',
      title: 'Choose Role',
      desc: 'Select from 50+ job roles and target difficulty levels.',
      icon: Target,
      color: 'text-[#E5A9A9]',
      bg: 'bg-[#E5A9A9]/10',
    },
    {
      num: '03',
      title: 'AI Generates Questions',
      desc: 'Receive unique resume-tailored behavioral and technical questions.',
      icon: BrainCircuit,
      color: 'text-slate-200',
      bg: 'bg-slate-200/10',
    },
    {
      num: '04',
      title: 'Answer by Voice',
      desc: 'Respond verbally as the AI tracks tone, clarity, and answers.',
      icon: Mic,
      color: 'text-slate-300',
      bg: 'bg-slate-300/10',
    },
    {
      num: '05',
      title: 'Receive Feedback',
      desc: 'Get granular scoring breakdowns and correct response guides.',
      icon: FileCheck2,
      color: 'text-slate-400',
      bg: 'bg-slate-400/10',
    },
    {
      num: '06',
      title: 'Improve and Repeat',
      desc: 'Review improvement tips and retake to check code/pitch changes.',
      icon: RefreshCw,
      color: 'text-slate-500',
      bg: 'bg-slate-500/10',
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-[#0A0A0A] relative z-10 border-t border-swiss-grid-border">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-24">
          <span className="font-mono text-xs text-[#E5A9A9] uppercase font-bold tracking-widest block mb-4">
            Workflow Flowchart
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-6">
            Six steps to mastery.
          </h2>
          <p className="text-sm font-sans font-medium text-text-secondary">
            Our optimized feedback loop takes you from upload to peak confidence in minutes.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Animated Connecting Line - Desktop Only */}
          <div className="hidden lg:block absolute top-10 left-12 right-12 h-[2px] bg-swiss-grid-border pointer-events-none">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-white via-[#E5A9A9] to-white shadow-[0_0_8px_#e5a9a9]"
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Bubble Icon */}
                  <div className="w-20 h-20 rounded-full neumorphic-flat flex items-center justify-center relative mb-6 group-hover:border-white/30 transition-all duration-300">
                    <div className={`w-14 h-14 rounded-full ${step.bg} border border-white/5 flex items-center justify-center relative`}>
                      <Icon className={`w-6 h-6 ${step.color}`} />
                    </div>

                    {/* Step Number Badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-elevated border border-swiss-grid-border flex items-center justify-center shadow-md">
                      <span className="text-[10px] font-mono font-bold text-white">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex flex-col gap-2 px-2">
                    <h3 className="text-sm font-display font-bold text-white group-hover:text-[#E5A9A9] transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-[11px] font-sans text-text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
