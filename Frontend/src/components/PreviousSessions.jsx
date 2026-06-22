import React, { useEffect, useState } from 'react';
import {
  History, ArrowLeft, ArrowRight, ChevronRight, CheckCircle2,
  Clock, Sparkles, AlertCircle, TrendingUp, BarChart2, Loader2, X, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  pending:   { label: 'In Progress', color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
};

function SessionCard({ session, onClick, index }) {
  const statusCfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending;
  const date = session._id
    ? new Date(parseInt(session._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -3, scale: 1.005 }}
      onClick={onClick}
      className="group glassmorphic-card rounded-2xl p-6 border border-white/8 cursor-pointer hover:border-[#E5A9A9]/30 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#E5A9A9]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between gap-4">
        {/* Left: icon + role + date */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-11 h-11 rounded-xl neumorphic-flat shrink-0 flex items-center justify-center border border-white/8">
            <BarChart2 className="w-5 h-5 text-[#E5A9A9]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-sans font-bold text-white truncate">{session.role}</p>
            <p className="text-[11px] font-mono text-text-secondary mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {date}
            </p>
          </div>
        </div>

        {/* Right: status + score + arrow */}
        <div className="flex items-center gap-4 shrink-0">
          {session.overallScore != null && (
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">Score</p>
              <p className="text-lg font-display font-black text-white leading-tight">
                {session.overallScore}<span className="text-text-secondary text-xs font-mono">/10</span>
              </p>
            </div>
          )}
          <span className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
            {session.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {statusCfg.label}
          </span>
          <ChevronRight className="w-4.5 h-4.5 text-text-secondary/40 group-hover:text-[#E5A9A9] group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </motion.div>
  );
}

export default function PreviousSessions({ currentUser, onNavigate }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const dbUrl = import.meta.env.VITE_DB_SERVICE_URL || 'http://localhost:5000/db';

  useEffect(() => {
    const fetchSessions = async () => {
      if (!currentUser?.uid) return;
      try {
        const res = await fetch(`${dbUrl}/getSessions/${currentUser.uid}`);
        if (!res.ok) throw new Error('Failed to load sessions');
        const data = await res.json();
        setSessions(data.sort((a, b) => {
          const ta = parseInt(a._id.substring(0, 8), 16);
          const tb = parseInt(b._id.substring(0, 8), 16);
          return tb - ta; // newest first
        }));
      } catch (err) {
        setError('Could not load sessions. Make sure the DB service is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [currentUser]);

  const openSessionDetail = async (session) => {
    setSelectedSession(session);
    setDetailLoading(true);
    try {
      const res = await fetch(`${dbUrl}/getQuestions/${session._id}`);
      if (!res.ok) throw new Error('Failed to load questions');
      const questions = await res.json();
      setSessionDetail(questions);
    } catch (err) {
      setSessionDetail([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedSession(null);
    setSessionDetail(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden relative grid-bg">
      {/* Ambient glows */}
      <div className="absolute top-[5%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E5A9A9]/3 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-white/2 blur-[130px] pointer-events-none z-0" />
      <div className="absolute left-[8%] right-[8%] top-0 bottom-0 border-l border-r border-white/5 pointer-events-none z-0 hidden lg:block" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-text-secondary hover:text-white transition-colors duration-200 uppercase group mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl neumorphic-flat flex items-center justify-center border border-white/8">
                <History className="w-5 h-5 text-[#E5A9A9]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight">
                Past Sessions
              </h1>
            </div>
            <p className="text-text-secondary text-sm font-sans">
              {sessions.length > 0
                ? `${sessions.length} session${sessions.length > 1 ? 's' : ''} found for your account`
                : 'Your interview history will appear here'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('new-interview')}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 shadow-xl text-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            New Interview
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-[#E5A9A9] animate-spin" />
            <p className="text-text-secondary text-sm font-mono">Loading sessions…</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 rounded-3xl neumorphic-flat flex items-center justify-center mx-auto mb-6 border border-white/8">
              <History className="w-10 h-10 text-text-secondary/50" />
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-3">No sessions yet</h2>
            <p className="text-text-secondary text-sm mb-8 max-w-sm mx-auto">
              You haven't completed any mock interviews yet. Start your first one now!
            </p>
            <button
              onClick={() => onNavigate('new-interview')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 shadow-xl cursor-pointer"
            >
              Start First Interview <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <SessionCard
                key={session._id}
                session={session}
                index={i}
                onClick={() => openSessionDetail(session)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Session Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedSession && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={closeDetail}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#111] border-l border-white/8 z-50 overflow-y-auto"
            >
              <div className="p-8">
                {/* Drawer Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">Session Detail</p>
                    <h2 className="text-2xl font-display font-black text-white">{selectedSession.role}</h2>
                    {selectedSession.overallScore != null && (
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-[#E5A9A9]" />
                        <span className="text-[#E5A9A9] font-mono font-bold text-sm">
                          Overall: {selectedSession.overallScore}/10
                        </span>
                      </div>
                    )}
                    {selectedSession.status === 'completed' && selectedSession.recommendations?.length > 0 && (
                      <div className="mt-4 p-4 rounded-xl border border-[#E5A9A9]/15 bg-[#E5A9A9]/5">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5A9A9] mb-2">Recommendations</p>
                        <ul className="space-y-1.5">
                          {selectedSession.recommendations.map((rec, i) => (
                            <li key={i} className="text-xs text-text-secondary font-sans flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-[#E5A9A9]/60 mt-1.5 shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={closeDetail}
                    className="flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-white transition-colors duration-200 cursor-pointer group mt-1"
                    aria-label="Close detail panel"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>

                {/* Coding Challenge Block */}
                {selectedSession.codingProblemTitle && (
                  <div className="glassmorphic-card rounded-2xl p-5 border border-white/8 mb-6 bg-white/2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-mono font-bold text-[#E5A9A9] bg-[#E5A9A9]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Code className="w-3 h-3" /> Coding Assessment
                      </span>
                      {selectedSession.codingScore != null && (
                        <span className="text-[10px] font-mono text-text-secondary ml-auto">
                          Score: <span className="text-white font-bold">{selectedSession.codingScore}/100</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-sans font-bold text-white mb-1">
                      {selectedSession.codingProblemTitle}
                    </h3>
                    <p className="text-xs text-text-secondary font-sans mb-4 leading-relaxed whitespace-pre-line">
                      {selectedSession.codingProblemDescription}
                    </p>

                    {selectedSession.codingSolution && (
                      <div className="mb-4">
                        <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1.5">
                          Submitted Solution ({selectedSession.codingLanguage})
                        </p>
                        <pre className="p-3.5 rounded-xl bg-[#080808] border border-white/5 font-mono text-xs text-white/95 overflow-x-auto max-h-48 leading-relaxed">
                          <code>{selectedSession.codingSolution}</code>
                        </pre>
                      </div>
                    )}

                    {selectedSession.codingFeedback && (
                      <div className="pt-3 border-t border-white/5">
                        <p className="text-[10px] font-mono text-[#E5A9A9] uppercase tracking-widest mb-1.5">
                          Liffy's Feedback
                        </p>
                        <p className="text-xs text-emerald-400/80 font-mono leading-relaxed">
                          💡 {selectedSession.codingFeedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Questions */}
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary mb-4">
                  Questions & Answers
                </p>
                {detailLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-[#E5A9A9] animate-spin" />
                  </div>
                ) : sessionDetail?.length === 0 ? (
                  <p className="text-text-secondary text-sm text-center py-10">No questions found for this session.</p>
                ) : (
                  <div className="space-y-5">
                    {sessionDetail?.map((q, i) => (
                      <div key={q._id} className="glassmorphic-card rounded-2xl p-5 border border-white/8">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-mono font-bold text-[#E5A9A9] bg-[#E5A9A9]/10 px-2 py-0.5 rounded-full">
                            Q{i + 1}
                          </span>
                          {q.overallScore != null && (
                            <span className="text-[10px] font-mono text-text-secondary ml-auto">
                              Score: <span className="text-white font-bold">{q.overallScore}/10</span>
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-sans font-semibold text-white mb-2">{q.mainQuestion}</p>
                        {q.mainAnswer && (
                          <p className="text-xs text-text-secondary font-sans mb-3 leading-relaxed border-l-2 border-[#E5A9A9]/30 pl-3">
                            {q.mainAnswer}
                          </p>
                        )}
                        {q.mainQuestionFeedback && (
                          <p className="text-[11px] text-emerald-400/80 font-mono mb-3">
                            💡 {q.mainQuestionFeedback}
                          </p>
                        )}

                        {q.followUpQuestion && (
                          <>
                            <div className="border-t border-white/5 pt-3 mt-3">
                              <p className="text-[10px] font-mono text-text-secondary uppercase tracking-wider mb-1.5">Follow-up</p>
                              <p className="text-sm font-sans font-semibold text-white/80 mb-2">{q.followUpQuestion}</p>
                              {q.followUpAnswer && (
                                <p className="text-xs text-text-secondary font-sans leading-relaxed border-l-2 border-white/10 pl-3">
                                  {q.followUpAnswer}
                                </p>
                              )}
                              {q.followUpFeedback && (
                                <p className="text-[11px] text-emerald-400/80 font-mono mt-2">
                                  💡 {q.followUpFeedback}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
