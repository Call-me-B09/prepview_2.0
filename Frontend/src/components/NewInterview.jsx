import React, { useState, useRef } from 'react';
import {
  Mic, Upload, ArrowLeft, ArrowRight, Sparkles,
  FileText, Briefcase, AlertCircle, CheckCircle, Loader2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Product Manager',
  'UX Designer',
  'DevOps Engineer',
  'Data Analyst',
];

export default function NewInterview({ currentUser, onNavigate, onInterviewStart }) {
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const effectiveRole = useCustom ? customRole : role;

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }
    setError('');
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!effectiveRole.trim()) {
      setError('Please select or enter a target role.');
      return;
    }
    if (!resumeFile) {
      setError('Please upload your resume to continue.');
      return;
    }

    setLoading(true);

    try {
      const orchUrl = import.meta.env.VITE_ORCHESTRATION_SERVICE_URL || 'http://localhost:4000';

      const formData = new FormData();
      formData.append('role', effectiveRole.trim());
      formData.append('uid', currentUser.uid);
      formData.append('name', currentUser.name || 'Candidate');
      formData.append('resume', resumeFile);

      const res = await fetch(`${orchUrl}/api/interview`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to start interview session.');
      }

      const data = await res.json();
      // Pass session data up so App can navigate to the interview workspace
      if (onInterviewStart) {
        onInterviewStart(data);
      } else {
        // Fallback: just navigate to sessions view
        onNavigate('sessions');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Connection failed. Make sure the Orchestration service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden relative grid-bg flex items-start justify-center pt-28 pb-16 px-6">
      {/* Ambient glows */}
      <div className="absolute top-[15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#E5A9A9]/4 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-white/2 blur-[130px] pointer-events-none z-0" />
      <div className="absolute left-[8%] right-[8%] top-0 bottom-0 border-l border-r border-white/5 pointer-events-none z-0 hidden lg:block" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Back button */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-text-secondary hover:text-white transition-colors duration-200 uppercase group mb-8"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <div className="glassmorphic-card rounded-3xl p-8 md:p-10 border border-white/8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-9">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-xl mb-5">
              <Mic className="w-7 h-7 text-slate-950" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neumorphic-inset text-xs text-[#E5A9A9] font-mono font-semibold tracking-widest uppercase mb-3">
              <Sparkles className="w-3 h-3" /> New Session
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight mb-2">
              Start Your Interview
            </h1>
            <p className="text-text-secondary text-sm font-sans max-w-sm">
              Select a target role and upload your resume. Our AI will craft personalised questions just for you.
            </p>
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
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold tracking-widest uppercase text-text-secondary pl-1">
                Target Role
              </label>

              {!useCustom ? (
                <>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary/50 pointer-events-none" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white font-sans bg-transparent focus:outline-none transition-colors neumorphic-inset appearance-none cursor-pointer"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <option value="" disabled className="bg-[#1a1a1a]">Choose a role…</option>
                      {ROLES.map(r => (
                        <option key={r} value={r} className="bg-[#1a1a1a] text-white">{r}</option>
                      ))}
                    </select>
                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/40 rotate-90 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseCustom(true)}
                    className="text-[11px] font-mono text-[#E5A9A9]/70 hover:text-[#E5A9A9] transition-colors cursor-pointer underline underline-offset-2"
                  >
                    Enter a custom role instead
                  </button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-secondary/50" />
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="e.g. Blockchain Engineer"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-text-secondary/40 font-sans focus:outline-none transition-colors neumorphic-inset"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setUseCustom(false); setCustomRole(''); }}
                    className="text-[11px] font-mono text-text-secondary/60 hover:text-white transition-colors cursor-pointer underline underline-offset-2"
                  >
                    Pick from list instead
                  </button>
                </>
              )}
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold tracking-widest uppercase text-text-secondary pl-1">
                Resume / CV
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              <AnimatePresence mode="wait">
                {resumeFile ? (
                  /* ── File selected: premium confirmation card ── */
                  <motion.div
                    key="file-selected"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative rounded-2xl overflow-hidden border border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 via-transparent to-transparent p-5"
                  >
                    {/* Subtle top glow line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

                    <div className="flex items-center gap-4">
                      {/* Animated doc icon */}
                      <div className="relative shrink-0">
                        <div className="w-14 h-16 rounded-xl bg-[#111] border border-emerald-500/20 flex flex-col items-center justify-center gap-1 p-2 shadow-lg">
                          <div className="w-full h-0.5 rounded-full bg-emerald-400/40" />
                          <div className="w-4/5 h-0.5 rounded-full bg-emerald-400/25" />
                          <div className="w-full h-0.5 rounded-full bg-emerald-400/40" />
                          <div className="w-3/5 h-0.5 rounded-full bg-emerald-400/25" />
                          <div className="w-full h-0.5 rounded-full bg-emerald-400/40" />
                        </div>
                        {/* Check badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
                        >
                          <CheckCircle className="w-3 h-3 text-white" />
                        </motion.div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1">
                          Resume Loaded
                        </p>
                        <p className="text-sm font-sans font-bold text-white truncate">{resumeFile.name}</p>
                        <p className="text-[11px] font-mono text-text-secondary mt-0.5">
                          {(resumeFile.size / 1024).toFixed(1)} KB &bull; Ready to analyse
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="shrink-0 w-8 h-8 rounded-lg border border-white/10 hover:border-red-400/40 hover:bg-red-400/10 flex items-center justify-center text-text-secondary hover:text-red-400 transition-all duration-200 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Drop zone: AI document scanner aesthetic ── */
                  <motion.div
                    key="drop-zone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover="hover"
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${
                      dragOver ? 'ring-2 ring-[#E5A9A9]/60' : ''
                    }`}
                  >
                    {/* Animated gradient border */}
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${dragOver ? 'opacity-100' : 'opacity-40'}`}
                      style={{
                        background: 'linear-gradient(135deg, #E5A9A9 0%, transparent 40%, transparent 60%, #E5A9A9 100%)',
                        padding: '1px',
                      }}
                    />
                    <div className="absolute inset-[1px] rounded-2xl bg-[#0e0e0e]" />

                    {/* Drag-over glow */}
                    <AnimatePresence>
                      {dragOver && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#E5A9A9]/5 rounded-2xl z-0"
                        />
                      )}
                    </AnimatePresence>

                    {/* Inner content */}
                    <div className="relative z-10 p-7 flex flex-col items-center">

                      {/* Animated document illustration */}
                      <div className="relative mb-5">
                        {/* Outer glow ring */}
                        <motion.div
                          variants={{ hover: { scale: 1.08, opacity: 0.6 } }}
                          className="absolute inset-[-6px] rounded-2xl bg-[#E5A9A9]/10 blur-md"
                        />

                        {/* Document card */}
                        <motion.div
                          variants={{ hover: { y: -3 } }}
                          transition={{ duration: 0.3 }}
                          className="relative w-20 h-24 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#141414] border border-white/12 shadow-2xl flex flex-col gap-1.5 p-3 overflow-hidden"
                        >
                          {/* Folded corner */}
                          <div className="absolute top-0 right-0 w-5 h-5 bg-[#0e0e0e]"
                            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                          />
                          <div className="absolute top-0 right-0 w-5 h-5 border-b border-l border-white/10 rounded-bl-md" />

                          {/* Text lines */}
                          {[100, 70, 90, 55, 80, 65].map((w, i) => (
                            <motion.div
                              key={i}
                              initial={{ scaleX: 0, originX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                              className="h-[3px] rounded-full bg-white/15"
                              style={{ width: `${w}%` }}
                            />
                          ))}

                          {/* AI scan beam */}
                          <motion.div
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5A9A9]/80 to-transparent"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                          />
                        </motion.div>

                        {/* Upload arrow badge */}
                        <motion.div
                          variants={{ hover: { scale: 1.15, rotate: -10 } }}
                          className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full gradient-primary shadow-lg flex items-center justify-center"
                        >
                          <Upload className="w-3.5 h-3.5 text-slate-950" />
                        </motion.div>
                      </div>

                      {/* CTA text */}
                      <motion.p
                        variants={{ hover: { color: '#ffffff' } }}
                        className="text-sm font-sans font-bold text-white/80 mb-1 transition-colors duration-200 text-center"
                      >
                        {dragOver ? '✦ Release to upload' : 'Drop your resume here'}
                      </motion.p>
                      <p className="text-[11px] font-mono text-text-secondary/60 text-center">
                        or <span className="text-[#E5A9A9]/70 underline underline-offset-2">click to browse</span>
                        {' '}— PDF, DOC, DOCX, TXT · Max 10 MB
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !effectiveRole.trim() || !resumeFile}
              className="w-full py-4 mt-2 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Setting up your session…</span>
                </>
              ) : (
                <>
                  <span>Start Interview</span>
                  <Mic className="w-4.5 h-4.5" />
                </>
              )}
            </button>

            {loading && (
              <p className="text-center text-[11px] font-mono text-text-secondary/60 tracking-wide animate-pulse">
                Parsing resume, generating personalised questions & audio…
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
