import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, Square, Volume2, Sparkles, Loader2,
  ArrowRight, Award, AlertCircle, RefreshCw, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActiveInterview({ currentUser, sessionData, onNavigate }) {
  // sessionData shape: { sessionId, introduction: { text, audio }, questions: [{ questionId, mainQuestion, audio }] }
  const { sessionId, introduction, questions } = sessionData;

  const [phase, setPhase] = useState('intro'); // 'intro' | 'question_audio' | 'main_answer_recording' | 'submitting_main_answer' | 'followup_audio' | 'followup_answer_recording' | 'submitting_followup_answer' | 'ready_next' | 'evaluating'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [followUpData, setFollowUpData] = useState(null); // { questionText, audio }
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState('');
  const [evalStep, setEvalStep] = useState(0);

  const currentAudioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const currentQuestion = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;

  // Mouth-flap speaking animation
  useEffect(() => {
    let interval;
    if (isSpeaking) {
      interval = setInterval(() => {
        setIsMouthOpen(prev => !prev);
      }, 140 + Math.random() * 40);
    } else {
      setIsMouthOpen(false);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Handle playing audio from base64 string
  const playBase64Audio = (base64String) => {
    if (!base64String) {
      setIsSpeaking(false);
      return;
    }
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      const audio = new Audio(`data:audio/wav;base64,${base64String}`);
      currentAudioRef.current = audio;

      audio.addEventListener('play', () => setIsSpeaking(true));
      audio.addEventListener('ended', () => setIsSpeaking(false));
      audio.addEventListener('pause', () => setIsSpeaking(false));
      audio.addEventListener('error', () => {
        setIsSpeaking(false);
        console.error("Audio playback error");
      });

      audio.play().catch(err => {
        console.error("Playback failed:", err);
        setIsSpeaking(false);
      });
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
    }
  };

  // Play introduction audio on mount
  useEffect(() => {
    if (phase === 'intro' && introduction?.audio) {
      // Small timeout to let component render and handle user browser policies
      const timer = setTimeout(() => {
        playBase64Audio(introduction.audio);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Timer for audio recording
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const handleStartInterview = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
    }
    setPhase('question_audio');
    playBase64Audio(currentQuestion.audio);
  };

  const startRecording = async () => {
    setError('');
    audioChunksRef.current = [];

    // Stop speaking if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/ogg' };
        if (!MediaRecorder.isTypeSupported('audio/ogg')) {
          options = { mimeType: 'audio/mp4' };
          if (!MediaRecorder.isTypeSupported('audio/mp4')) {
            options = {};
          }
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await uploadAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied. Please verify input permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    const isMain = phase === 'main_answer_recording';
    setPhase(isMain ? 'submitting_main_answer' : 'submitting_followup_answer');

    const orchUrl = import.meta.env.VITE_ORCHESTRATION_SERVICE_URL || 'http://localhost:4000';
    const endpoint = isMain ? '/api/submitMainAnswer' : '/api/submitFollowUpAnswer';

    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('questionId', currentQuestion.questionId);
    formData.append('audio', audioBlob, 'response.webm');

    try {
      const res = await fetch(`${orchUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to process audio answer.");
      }

      const data = await res.json();

      if (isMain) {
        setFollowUpData({
          text: data.followUpQuestion,
          audio: data.followUpAudio
        });
        setPhase('followup_audio');
        playBase64Audio(data.followUpAudio);
      } else {
        setPhase('ready_next');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit answer. Please retry recording.");
      setPhase(isMain ? 'main_answer_recording' : 'followup_answer_recording');
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      triggerEvaluation();
    } else {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setFollowUpData(null);
      setPhase('question_audio');
      playBase64Audio(questions[nextIdx].audio);
    }
  };

  // Evaluation stages tracker
  useEffect(() => {
    let interval;
    if (phase === 'evaluating') {
      interval = setInterval(() => {
        setEvalStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const triggerEvaluation = async () => {
    setPhase('evaluating');
    setEvalStep(0);
    const orchUrl = import.meta.env.VITE_ORCHESTRATION_SERVICE_URL || 'http://localhost:4000';

    try {
      const res = await fetch(`${orchUrl}/api/finishSession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!res.ok) {
        throw new Error("Evaluation request failed.");
      }

      // Successfully evaluated! Go back to sessions to view report
      onNavigate('sessions');
    } catch (err) {
      console.error(err);
      setError("AI final analysis failed. Please try finishing the interview session again.");
      setPhase('ready_next');
    }
  };

  const handleReplay = () => {
    if (phase === 'intro') {
      playBase64Audio(introduction.audio);
    } else if (phase === 'question_audio') {
      playBase64Audio(currentQuestion.audio);
    } else if (phase === 'followup_audio') {
      playBase64Audio(followUpData?.audio);
    }
  };

  const formattedTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden relative grid-bg flex items-start justify-center pt-28 pb-16 px-6">
      {/* Ambient glows */}
      <div className="absolute top-[10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#E5A9A9]/3 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-white/1.5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute left-[8%] right-[8%] top-0 bottom-0 border-l border-r border-white/5 pointer-events-none z-0 hidden lg:block" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="glassmorphic-card rounded-3xl p-8 md:p-10 border border-white/8 shadow-2xl relative overflow-hidden">
          {/* Top Progress bar */}
          {phase !== 'intro' && phase !== 'evaluating' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
              <motion.div
                className="h-full gradient-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentQuestionIdx + (phase === 'ready_next' ? 1 : 0.5)) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}

          {/* Header Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neumorphic-inset text-[10px] text-[#E5A9A9] font-mono font-semibold tracking-widest uppercase">
              <Sparkles className="w-3 h-3" /> Live Interview
            </div>
            {phase !== 'intro' && phase !== 'evaluating' && (
              <span className="text-xs font-mono text-text-secondary">
                Question {currentQuestionIdx + 1} of {questions.length}
              </span>
            )}
          </div>

          {/* Character Liffy Display */}
          <div className="flex flex-col items-center justify-center mb-8 relative">
            <div className="w-36 h-36 rounded-full border-2 border-white/10 overflow-hidden bg-[#141414] shadow-xl relative flex items-center justify-center p-2 group transition-all duration-300 hover:border-[#E5A9A9]/40">
              <img
                src={isMouthOpen ? "/images/liffyclose.png" : "/images/liffyclosed.png"}
                alt="Liffy Interviewer"
                className="w-full h-full object-contain rounded-full select-none"
              />
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full border border-[#E5A9A9]/60 animate-ping opacity-25" />
              )}
            </div>
            <p className="mt-3 font-display font-black text-sm tracking-wide text-white">LIFFY</p>
            <p className="text-[10px] font-mono text-[#E5A9A9] tracking-widest uppercase">AI Interviewer</p>
          </div>

          {/* Interactive Screen Phases */}
          <AnimatePresence mode="wait">
            {/* ── PHASE 1: Introduction ── */}
            {phase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6"
              >
                <div className="neumorphic-inset rounded-2xl p-5 border border-white/5">
                  <p className="text-sm font-sans italic text-text-secondary leading-relaxed">
                    "{introduction?.text}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  {introduction?.audio && (
                    <button
                      onClick={handleReplay}
                      disabled={isSpeaking}
                      className="px-5 py-3 rounded-xl border border-white/10 hover:border-white/20 text-xs font-mono font-bold tracking-wider text-text-secondary hover:text-white flex items-center gap-2 cursor-pointer disabled:opacity-40"
                    >
                      <Volume2 className="w-4 h-4" /> REPLAY INTRO
                    </button>
                  )}
                  <button
                    onClick={handleStartInterview}
                    className="px-6 py-3 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg w-full sm:w-auto justify-center"
                  >
                    Begin Interview <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── PHASE 2: Playing Question Audio ── */}
            {phase === 'question_audio' && (
              <motion.div
                key="question-audio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6"
              >
                <div className="neumorphic-inset rounded-2xl p-5 border border-white/5">
                  <p className="text-sm font-mono text-[#E5A9A9] text-left uppercase tracking-wider mb-2">Question</p>
                  <p className="text-base font-sans font-bold text-white text-left leading-relaxed">
                    {currentQuestion.mainQuestion}
                  </p>
                </div>

                {isSpeaking ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-1.5 justify-center items-center h-6">
                      {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ['8px', `${h * 4}px`, '8px'] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
                          className="w-[2.5px] rounded-full bg-[#E5A9A9]"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-text-secondary tracking-widest uppercase">Liffy is speaking...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleReplay}
                    className="mx-auto px-4 py-2.5 rounded-xl border border-white/8 hover:border-white/15 text-xs font-mono font-bold tracking-wider text-text-secondary hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Listen Again
                  </button>
                )}

                <button
                  onClick={() => setPhase('main_answer_recording')}
                  className="w-full py-4 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Mic className="w-5 h-5" />
                  <span>Answer Question</span>
                </button>
              </motion.div>
            )}

            {/* ── PHASE 3: Recording Main Answer ── */}
            {phase === 'main_answer_recording' && (
              <motion.div
                key="main-recording"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6"
              >
                <div className="neumorphic-inset rounded-2xl p-5 border border-white/5 text-left">
                  <p className="text-[10px] font-mono text-text-secondary uppercase tracking-wider mb-2">Answering Question</p>
                  <p className="text-sm font-sans text-white/80 leading-relaxed font-semibold">
                    {currentQuestion.mainQuestion}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  {isRecording ? (
                    <>
                      {/* Bouncing Visualizer */}
                      <div className="flex gap-2 justify-center items-center h-12">
                        {[1.5, 3, 2, 4.5, 2.5, 3.5, 1.5].map((scale, i) => (
                          <motion.div
                            key={i}
                            animate={{ scaleY: [1, scale, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.07 }}
                            className="w-[3px] h-6 rounded-full bg-red-400 origin-center"
                          />
                        ))}
                      </div>
                      <span className="text-xl font-mono font-bold text-white tracking-widest">
                        {formattedTime(recordingSeconds)}
                      </span>
                      <button
                        onClick={stopRecording}
                        className="px-6 py-3.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/15 text-xs font-mono font-bold tracking-wider text-red-400 flex items-center gap-2 cursor-pointer shadow-md uppercase"
                      >
                        <Square className="w-4 h-4 fill-red-400" /> Stop & Process
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E5A9A9] to-red-400 hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl cursor-pointer transition-all duration-200"
                    >
                      <Mic className="w-10 h-10 text-slate-950" />
                    </button>
                  )}
                  {!isRecording && (
                    <span className="text-[10px] font-mono text-text-secondary tracking-widest uppercase">Click to start recording</span>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── PHASE 4: Submitting Main Answer Loader ── */}
            {phase === 'submitting_main_answer' && (
              <motion.div
                key="submitting-main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10 space-y-4"
              >
                <Loader2 className="w-10 h-10 text-[#E5A9A9] animate-spin mx-auto" />
                <h3 className="text-base font-sans font-bold text-white">Transcribing audio answer...</h3>
                <p className="text-xs font-mono text-text-secondary/70">
                  Sending recording to Assembly AI Speech service
                </p>
              </motion.div>
            )}

            {/* ── PHASE 5: Playing Follow-Up Question Audio ── */}
            {phase === 'followup_audio' && (
              <motion.div
                key="followup-audio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6"
              >
                <div className="neumorphic-inset rounded-2xl p-5 border border-white/5">
                  <p className="text-xs font-mono text-[#E5A9A9] text-left uppercase tracking-wider mb-2">Follow-up Question</p>
                  <p className="text-base font-sans font-bold text-white text-left leading-relaxed">
                    {followUpData?.text}
                  </p>
                </div>

                {isSpeaking ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-1.5 justify-center items-center h-6">
                      {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ['8px', `${h * 4}px`, '8px'] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
                          className="w-[2.5px] rounded-full bg-[#E5A9A9]"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-text-secondary tracking-widest uppercase">Liffy is speaking...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleReplay}
                    className="mx-auto px-4 py-2.5 rounded-xl border border-white/8 hover:border-white/15 text-xs font-mono font-bold tracking-wider text-text-secondary hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Listen Again
                  </button>
                )}

                <button
                  onClick={() => setPhase('followup_answer_recording')}
                  className="w-full py-4 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Mic className="w-5 h-5" />
                  <span>Answer Follow-up</span>
                </button>
              </motion.div>
            )}

            {/* ── PHASE 6: Recording Follow-Up Answer ── */}
            {phase === 'followup_answer_recording' && (
              <motion.div
                key="followup-recording"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6"
              >
                <div className="neumorphic-inset rounded-2xl p-5 border border-white/5 text-left">
                  <p className="text-[10px] font-mono text-text-secondary uppercase tracking-wider mb-2">Answering Follow-up</p>
                  <p className="text-sm font-sans text-white/80 leading-relaxed font-semibold">
                    {followUpData?.text}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  {isRecording ? (
                    <>
                      <div className="flex gap-2 justify-center items-center h-12">
                        {[1.5, 3, 2, 4.5, 2.5, 3.5, 1.5].map((scale, i) => (
                          <motion.div
                            key={i}
                            animate={{ scaleY: [1, scale, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.07 }}
                            className="w-[3px] h-6 rounded-full bg-red-400 origin-center"
                          />
                        ))}
                      </div>
                      <span className="text-xl font-mono font-bold text-white tracking-widest">
                        {formattedTime(recordingSeconds)}
                      </span>
                      <button
                        onClick={stopRecording}
                        className="px-6 py-3.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/15 text-xs font-mono font-bold tracking-wider text-red-400 flex items-center gap-2 cursor-pointer shadow-md uppercase"
                      >
                        <Square className="w-4 h-4 fill-red-400" /> Stop & Process
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E5A9A9] to-red-400 hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl cursor-pointer transition-all duration-200"
                    >
                      <Mic className="w-10 h-10 text-slate-950" />
                    </button>
                  )}
                  {!isRecording && (
                    <span className="text-[10px] font-mono text-text-secondary tracking-widest uppercase">Click to start recording</span>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── PHASE 7: Submitting Follow-Up Answer Loader ── */}
            {phase === 'submitting_followup_answer' && (
              <motion.div
                key="submitting-followup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10 space-y-4"
              >
                <Loader2 className="w-10 h-10 text-[#E5A9A9] animate-spin mx-auto" />
                <h3 className="text-base font-sans font-bold text-white">Transcribing follow-up answer...</h3>
                <p className="text-xs font-mono text-text-secondary/70">
                  Sending recording to Assembly AI Speech service
                </p>
              </motion.div>
            )}

            {/* ── PHASE 8: Ready for Next Question ── */}
            {phase === 'ready_next' && (
              <motion.div
                key="ready-next"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6"
              >
                <div className="rounded-2xl p-5 border border-emerald-500/10 bg-emerald-500/5 text-emerald-400/80 text-sm font-sans flex items-center justify-center gap-3">
                  <Award className="w-5 h-5 shrink-0" />
                  <span>Answer saved successfully! Liffy is ready to proceed.</span>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-4 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{isLastQuestion ? 'Complete Interview' : 'Next Question'}</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </motion.div>
            )}

            {/* ── PHASE 9: Generating Session Evaluation ── */}
            {phase === 'evaluating' && (
              <motion.div
                key="evaluating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 space-y-8"
              >
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                  <Loader2 className="w-16 h-16 text-[#E5A9A9] animate-spin absolute inset-0" />
                </div>

                <div>
                  <h3 className="text-lg font-display font-black text-white mb-2">Analyzing Interview Session</h3>
                  <p className="text-xs font-mono text-text-secondary max-w-xs mx-auto">
                    Please do not close this window. Our AI engines are running evaluations.
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="max-w-xs mx-auto text-left space-y-3.5 border-t border-white/5 pt-6 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${evalStep >= 0 ? 'bg-emerald-500' : 'bg-white/10'}`} />
                    <span className={evalStep >= 0 ? 'text-white font-bold' : 'text-text-secondary'}>
                      Analyzing speech-to-text accuracy...
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${evalStep >= 1 ? 'bg-emerald-500 animate-pulse' : 'bg-white/10'}`} />
                    <span className={evalStep >= 1 ? 'text-white font-bold' : 'text-text-secondary'}>
                      Evaluating main response content...
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${evalStep >= 2 ? 'bg-emerald-500 animate-pulse' : 'bg-white/10'}`} />
                    <span className={evalStep >= 2 ? 'text-white font-bold' : 'text-text-secondary'}>
                      Grading follow-up details & vocabulary...
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${evalStep >= 3 ? 'bg-emerald-500 animate-pulse' : 'bg-white/10'}`} />
                    <span className={evalStep >= 3 ? 'text-white font-bold' : 'text-text-secondary'}>
                      Compiling session recommendations...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-start gap-3"
              >
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{error}</span>
                  {(phase === 'main_answer_recording' || phase === 'followup_answer_recording') && (
                    <button
                      onClick={startRecording}
                      className="block mt-2 font-mono text-[#E5A9A9]/80 hover:text-[#E5A9A9] underline cursor-pointer"
                    >
                      Retry Recording
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
