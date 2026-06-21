import React, { useState } from 'react';
import { 
  FileText, Sparkles, Mic, FileCheck, BarChart3, 
  Check, ArrowRight, Play, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState('resume');

  const tabs = [
    { id: 'resume', label: 'Resume Analysis', icon: FileText },
    { id: 'questions', label: 'Generated Questions', icon: Sparkles },
    { id: 'recording', label: 'Voice Recording', icon: Mic },
    { id: 'feedback', label: 'AI Feedback', icon: FileCheck },
    { id: 'dashboard', label: 'Score Dashboard', icon: BarChart3 },
  ];

  // Render content based on active tab
  const renderPanel = () => {
    switch (activeTab) {
      case 'resume':
        return (
          <motion.div
            key="resume"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Left side: Upload card */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="neumorphic-inset rounded-xl p-5 border border-swiss-grid-border">
                <span className="text-[10px] font-mono text-[#8B5CF6] uppercase font-bold tracking-wider">Source Document</span>
                <div className="flex items-center gap-3 mt-3 bg-surface p-3 rounded-lg border border-swiss-grid-border">
                  <div className="w-10 h-10 rounded bg-[#4F46E5]/10 flex items-center justify-center border border-[#4F46E5]/20">
                    <FileText className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-white block">resume_john_doe.pdf</span>
                    <span className="text-[9px] text-text-secondary font-mono">148 KB • PDF Version</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-mono text-text-secondary">
                    <span>Targeting Role</span>
                    <span className="text-white font-bold">Staff Software Engineer</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-text-secondary">
                    <span>Parsed Skillsets</span>
                    <span className="text-white font-bold">14 identified</span>
                  </div>
                </div>
              </div>

              <div className="neumorphic-flat rounded-xl p-5 border border-swiss-grid-border">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">ATS Score Peak</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-display font-black text-white">96%</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Highly Optimized</span>
                </div>
              </div>
            </div>

            {/* Right side: Resume analysis breakdown */}
            <div className="md:col-span-7 neumorphic-flat rounded-xl p-6 border border-swiss-grid-border flex flex-col gap-5">
              <div>
                <h4 className="text-sm font-display font-bold text-white">Keyword Matching & Highlights</h4>
                <p className="text-xs text-text-secondary mt-1">Found highly relevant keywords for Staff Engineer role.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['System Design', 'Scalability', 'Microservices', 'GraphQL', 'Kubernetes', 'CI/CD Pipelines', 'Mentorship', 'React / Next.js'].map((kw, i) => (
                  <span key={i} className="text-[10px] font-mono font-medium text-white bg-elevated border border-swiss-grid-border px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    {kw}
                  </span>
                ))}
              </div>

              <div className="h-[1px] bg-swiss-grid-border w-full" />

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-[#8B5CF6] uppercase font-bold">Key Recommendation</span>
                <p className="text-xs text-text-secondary leading-relaxed bg-surface/50 border border-swiss-grid-border p-3 rounded-lg">
                  "Your resume highlights <strong className="text-white">Scalability</strong> extensively, but lacks metrics around <strong className="text-white">Cost Reduction</strong>. Our questions will focus on evaluating resource optimization."
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'questions':
        return (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="text-[10px] font-mono text-[#8B5CF6] uppercase font-bold tracking-wider">Dynamic Question Generator</span>
              <h4 className="text-sm font-display font-bold text-white mt-1">Generated Questions based on Resume & Staff Role</h4>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  id: 'Q1',
                  type: 'System Design',
                  text: 'Explain how you would design a cache consistency mechanism for a highly distributed system experiencing write-heavy traffic.',
                  diff: 'Hard',
                  diffColor: 'text-red-400 bg-red-500/10 border-red-500/20'
                },
                {
                  id: 'Q2',
                  type: 'Leadership & Conflict',
                  text: 'Tell me about a time when you had to disagree with a product manager regarding technical debt versus feature rollout. How did you align?',
                  diff: 'Medium',
                  diffColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                },
                {
                  id: 'Q3',
                  type: 'Technical Deep-Dive',
                  text: 'In your resume, you listed migrating to a micro-frontend architecture. What was your strategy for shared state and dependency locking?',
                  diff: 'Hard',
                  diffColor: 'text-red-400 bg-red-500/10 border-red-500/20'
                }
              ].map((q, i) => (
                <div key={i} className="neumorphic-flat rounded-xl p-5 border border-swiss-grid-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-swiss-grid-border flex items-center justify-center shrink-0">
                      <span className="text-xs font-mono font-bold text-[#8B5CF6]">{q.id}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-[#8B5CF6] uppercase font-bold tracking-wider">{q.type}</span>
                      <p className="text-xs text-white font-medium mt-1 leading-relaxed">{q.text}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded border self-start md:self-center shrink-0 ${q.diffColor}`}>
                    {q.diff}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'recording':
        return (
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Voice Wave panel */}
            <div className="md:col-span-5 neumorphic-inset rounded-xl p-6 border border-swiss-grid-border flex flex-col items-center justify-center gap-6 text-center">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-[#8B5CF6]/20 animate-ping" />
                <button className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center shadow-lg relative z-10 border border-white/20">
                  <Mic className="w-8 h-8 text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Voice Connected</span>
                <span className="text-2xl font-display font-black text-white">01:42 / 03:00</span>
              </div>

              <p className="text-[10px] text-text-secondary font-mono leading-none">Press anywhere to pause recording</p>
            </div>

            {/* Live speech transcription */}
            <div className="md:col-span-7 neumorphic-flat rounded-xl p-6 border border-swiss-grid-border flex flex-col gap-4">
              <span className="text-[10px] font-mono text-[#8B5CF6] uppercase font-bold tracking-wider">Live Speech Transcription</span>
              <div className="flex-1 bg-surface/50 border border-swiss-grid-border rounded-lg p-4 font-sans text-xs text-white leading-relaxed overflow-y-auto min-h-[160px] relative">
                "In my last role, I led the migration of a legacy monolithic frontend to micro-frontends. The main challenge was ensuring that the shared state remained synchronized across routing transitions. We implemented a unified event bus using custom browser events, which minimized page load overhead while decoupling module dependencies..."
                {/* Typing cursor blink */}
                <span className="w-1.5 h-4 bg-[#8B5CF6] inline-block animate-pulse ml-1 align-middle" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary">
                <span>Speaking Rate: 135 WPM</span>
                <span className="text-emerald-400 font-bold">Optimal Speed</span>
              </div>
            </div>
          </motion.div>
        );

      case 'feedback':
        return (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Feedback Summary Cards */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="neumorphic-flat rounded-xl p-5 border border-swiss-grid-border flex flex-col gap-3">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Technical Accuracy</span>
                <span className="text-3xl font-display font-black text-white">92%</span>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Excellent usage of technical terminology like 'event bus' and 'dependency locking'.
                </p>
              </div>

              <div className="neumorphic-flat rounded-xl p-5 border border-swiss-grid-border flex flex-col gap-3">
                <span className="text-[10px] font-mono text-[#8B5CF6] font-bold uppercase">Communication Clarity</span>
                <span className="text-3xl font-display font-black text-white">88%</span>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Smooth delivery with negligible filler words (0.8% count). Good articulation.
                </p>
              </div>
            </div>

            {/* Critique breakdown */}
            <div className="lg:col-span-8 neumorphic-flat rounded-xl p-6 border border-swiss-grid-border flex flex-col gap-5">
              <span className="text-[10px] font-mono text-[#8B5CF6] uppercase font-bold tracking-wider">AI Coach Feedback Breakdown</span>

              <div className="flex flex-col gap-4">
                <div className="flex gap-3 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Strength: Specific Metrics</span>
                    <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                      You clearly explained how micro-frontends decoupled modules, which demonstrates real-world application.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 bg-[#4F46E5]/5 border border-[#4F46E5]/10 p-4 rounded-lg">
                  <Sparkles className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Suggested Improvement (Better Wording)</span>
                    <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                      Instead of saying <em className="text-red-400">"we just used custom browser events"</em>, rephrase to <em className="text-emerald-400">"we orchestrated a custom browser-native event dispatch system to eliminate third-party bundle weight."</em>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Score wheels */}
            <div className="md:col-span-5 neumorphic-flat rounded-xl p-6 border border-swiss-grid-border flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#8B5CF6] uppercase font-bold">Overall Verdict</span>
                <span className="text-2xl font-display font-black text-white block mt-1">Strong Hire</span>
                <span className="text-[10px] text-text-secondary font-mono">Ranked: Top 5% of candidate base</span>
              </div>

              <div className="h-[1px] bg-swiss-grid-border w-full" />

              <div className="flex justify-between items-center">
                <span className="text-xs font-sans text-text-secondary font-medium">Completed Mock Sessions</span>
                <span className="text-xs font-mono font-bold text-white">8 Sessions</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-sans text-text-secondary font-medium">Confidence Level Growth</span>
                <span className="text-xs font-mono font-bold text-emerald-400">+34%</span>
              </div>
            </div>

            {/* Performance charts */}
            <div className="md:col-span-7 neumorphic-flat rounded-xl p-6 border border-swiss-grid-border flex flex-col gap-6">
              <span className="text-[10px] font-mono text-[#8B5CF6] uppercase font-bold tracking-wider">Evaluation Benchmarks</span>

              <div className="flex flex-col gap-4">
                {[
                  { name: 'System Architecture Design', score: 94 },
                  { name: 'Clarity of Pitch & Tone', score: 87 },
                  { name: 'Problem Solving & Structure', score: 91 },
                  { name: 'Behavioral Alignment (STAR Method)', score: 95 }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-text-secondary font-medium">{item.name}</span>
                      <span className="text-white font-bold">{item.score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-elevated overflow-hidden border border-swiss-grid-border">
                      <div 
                        style={{ width: `${item.score}%` }}
                        className="h-full gradient-primary rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="showcase" className="py-32 bg-[#0A0A0A] relative overflow-hidden border-b border-swiss-grid-border">
      {/* Background glowing ambient elements */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#4F46E5]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-xs text-[#8B5CF6] uppercase font-bold tracking-widest block mb-4">
            Product Walkthrough
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-6">
            Inside the platform.
          </h2>
          <p className="text-sm font-sans font-medium text-text-secondary">
            Get an interactive preview of the components making up the PrepView 2.0 workspaces.
          </p>
        </div>

        {/* Showcase Wrapper */}
        <div className="flex flex-col gap-8">
          
          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-xs font-mono tracking-wide font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-elevated text-[#8B5CF6] border-[#8B5CF6]/50 shadow-inner border'
                      : 'text-text-secondary hover:text-white border border-transparent neumorphic-button'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#8B5CF6]' : 'text-text-secondary'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Interactive Window Content */}
          <div className="w-full rounded-2xl bg-surface border border-swiss-grid-border overflow-hidden shadow-2xl p-6 md:p-8 neumorphic-flat relative">
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#000]/10 to-transparent pointer-events-none" />
            <AnimatePresence mode="wait">
              {renderPanel()}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
