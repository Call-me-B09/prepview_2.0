import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Mic, Square, Volume2, Sparkles, Loader2,
  ArrowRight, Award, AlertCircle, RefreshCw, BarChart2,
  Maximize2, Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const highlightCode = (code, language) => {
  if (!code) {
    const placeholderText = language === 'pseudocode' 
      ? "// Describe your logic, steps, or algorithm pseudocode here..."
      : `// Write your ${language} solution here...`;
    return `<span class="text-white/20 select-none">${placeholderText}</span>`;
  }
  
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt bridge;"); // Escape HTML correctly
  
  // Re-correct replace typo in escape helper
  escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 1. Comments: // or /* ... */
  const comments = [];
  escaped = escaped.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, (match) => {
    comments.push(match);
    return `__COMMENT_${comments.length - 1}__`;
  });

  // 2. Strings: "..." or '...' or `...`
  const strings = [];
  escaped = escaped.replace(/(["'`])(.*?)\1/g, (match) => {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });

  // 3. Keywords list based on language
  const jsKeywords = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|export|import|from|default|new|this|typeof|instanceof|async|await|try|catch|finally|throw|true|false|null|undefined)\b/g;
  const pyKeywords = /\b(def|return|if|elif|else|for|while|in|is|not|and|or|import|from|as|class|try|except|finally|raise|assert|global|nonlocal|lambda|pass|break|continue|True|False|None)\b/g;
  const cppKeywords = /\b(int|double|float|char|bool|void|class|struct|public|private|protected|template|typename|return|if|else|for|while|do|switch|case|break|continue|new|delete|this|try|catch|throw|namespace|using|std|true|false|const)\b/g;
  const javaKeywords = /\b(public|private|protected|class|interface|enum|extends|implements|import|package|return|if|else|for|while|do|switch|case|break|continue|new|this|super|try|catch|finally|throw|throws|static|final|void|int|double|float|char|boolean|long|short|byte|true|false|null)\b/g;

  let keywordsRegex = jsKeywords;
  if (language === 'python') keywordsRegex = pyKeywords;
  else if (language === 'cpp') keywordsRegex = cppKeywords;
  else if (language === 'java') keywordsRegex = javaKeywords;
  else if (language === 'pseudocode') {
    keywordsRegex = /\b(Algorithm|Procedure|Function|Input|Output|Return|If|Then|Else|End|For|To|While|Do|Repeat|Until|True|False|Null|AND|OR|NOT)\b/gi;
  }

  // Highlight keywords
  escaped = escaped.replace(keywordsRegex, '<span class="text-pink-400 font-bold">$1</span>');

  // 4. Numbers
  escaped = escaped.replace(/\b(\d+)\b/g, '<span class="text-amber-300">$1</span>');

  // 5. Common Built-ins or types (like console, log, print, std::cout, System.out.println)
  const builtins = /\b(console|log|print|printf|cout|cin|endl|System|out|println|Math|abs|max|min|len|range|list|dict|set|tuple|vector|string|map|unordered_map)\b/g;
  escaped = escaped.replace(builtins, '<span class="text-sky-300 font-semibold">$1</span>');

  // 6. Function definitions (e.g. functionName followed by parenthesis)
  escaped = escaped.replace(/\b(\w+)(?=\()/g, '<span class="text-yellow-200">$1</span>');

  // Restore strings and comments with styling
  escaped = escaped.replace(/__STRING_(\d+)__/g, (_, idx) => {
    return `<span class="text-green-300">${strings[idx]}</span>`;
  });
  escaped = escaped.replace(/__COMMENT_(\d+)__/g, (_, idx) => {
    return `<span class="text-zinc-500 font-normal italic">${comments[idx]}</span>`;
  });

  return escaped;
};

export default function ActiveInterview({ currentUser, sessionData, onNavigate }) {
  // sessionData shape: { sessionId, introduction: { text, audio }, questions: [{ questionId, mainQuestion, audio }], codingQuestion }
  const { sessionId, introduction, questions, codingQuestion } = sessionData;

  const [phase, setPhase] = useState('intro'); // 'intro' | 'question_audio' | 'main_answer_recording' | 'submitting_main_answer' | 'followup_audio' | 'followup_answer_recording' | 'submitting_followup_answer' | 'ready_next' | 'coding_challenge' | 'submitting_coding_answer' | 'evaluating'
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [codeContent, setCodeContent] = useState('');
  const [codingScore, setCodingScore] = useState(null);
  const [codingFeedback, setCodingFeedback] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [followUpData, setFollowUpData] = useState(null); // { questionText, audio }
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState('');
  const [evalStep, setEvalStep] = useState(0);
  const [lastAnswerEmpty, setLastAnswerEmpty] = useState(false);
  const [solutions, setSolutions] = useState({ javascript: '', python: '', cpp: '', java: '', pseudocode: '' });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentAudioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const highlightOverlayRef = useRef(null);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDownGlobally = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobally);
    return () => window.removeEventListener('keydown', handleKeyDownGlobally);
  }, [isFullscreen]);

  const handleEditorScroll = () => {
    if (textareaRef.current) {
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      }
      if (highlightOverlayRef.current) {
        highlightOverlayRef.current.scrollTop = textareaRef.current.scrollTop;
        highlightOverlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
    }
  };

  const handleCodeChange = (val) => {
    setCodeContent(val);
    setSolutions(prev => ({
      ...prev,
      [selectedLanguage]: val
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = codeContent.substring(0, start) + "  " + codeContent.substring(end);
      
      handleCodeChange(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const currentQuestion = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;

  // Preload Liffy assets to avoid flickers/delays in mouth-flap frame changes
  useEffect(() => {
    const openImg = new Image();
    openImg.src = "/images/liffyopen.png";
    const closeImg = new Image();
    closeImg.src = "/images/liffyclose.png";
  }, []);

  // Initialize solutions once on codingQuestion change
  useEffect(() => {
    if (codingQuestion?.starterCode) {
      try {
        const templates = typeof codingQuestion.starterCode === 'string'
          ? JSON.parse(codingQuestion.starterCode)
          : codingQuestion.starterCode;
        setSolutions(templates || { javascript: '', python: '', cpp: '', java: '', pseudocode: '' });
        setCodeContent(templates[selectedLanguage] || '');
      } catch (err) {
        console.error("Failed to parse starter code templates:", err);
      }
    }
  }, [codingQuestion]);

  // Update code content when selectedLanguage changes
  useEffect(() => {
    setCodeContent(solutions[selectedLanguage] || '');
  }, [selectedLanguage]);

  // Mouth-flap speaking animation using a recursive timeout for natural speaking cadences
  useEffect(() => {
    let timeoutId = null;

    const toggleMouth = () => {
      if (isSpeaking) {
        setIsMouthOpen(prev => !prev);
        // Vary the frame rate dynamically between 100ms and 240ms to simulate natural speech syllables
        const nextDelay = 100 + Math.random() * 140;
        timeoutId = setTimeout(toggleMouth, nextDelay);
      } else {
        setIsMouthOpen(false);
      }
    };

    if (isSpeaking) {
      // Start flapping
      toggleMouth();
    } else {
      setIsMouthOpen(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
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

      audio.play()
        .then(() => setIsSpeaking(true))
        .catch(err => {
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
        if (data.hasFollowUp) {
          setLastAnswerEmpty(false);
          setFollowUpData({
            text: data.followUpQuestion,
            audio: data.followUpAudio
          });
          setPhase('followup_audio');
          playBase64Audio(data.followUpAudio);
        } else {
          setLastAnswerEmpty(true);
          setPhase('ready_next');
        }
      } else {
        setLastAnswerEmpty(false);
        setPhase('ready_next');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit answer. Please retry recording.");
      setPhase(isMain ? 'main_answer_recording' : 'followup_answer_recording');
    }
  };

  const handleNextQuestion = () => {
    setLastAnswerEmpty(false);
    if (isLastQuestion) {
      if (codingQuestion) {
        setPhase('coding_challenge');
        playBase64Audio(codingQuestion.audio);
      } else {
        triggerEvaluation();
      }
    } else {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setFollowUpData(null);
      setPhase('question_audio');
      playBase64Audio(questions[nextIdx].audio);
    }
  };

  const submitCodingSolution = async () => {
    setError('');
    setPhase('submitting_coding_answer');
    setIsFullscreen(false);

    const orchUrl = import.meta.env.VITE_ORCHESTRATION_SERVICE_URL || 'http://localhost:4000';

    try {
      const res = await fetch(`${orchUrl}/api/submitCodingAnswer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          codingLanguage: selectedLanguage,
          codingSolution: codeContent
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to process coding solution.");
      }

      const data = await res.json();
      setCodingScore(data.score);
      setCodingFeedback(data.feedback);

      // Trigger final evaluation
      triggerEvaluation();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit coding solution. Please retry.");
      setPhase('coding_challenge');
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
        className="w-full max-w-6xl relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ── LEFT COLUMN: Mock Video Feed ── */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="glassmorphic-card rounded-3xl p-6 md:p-8 border border-white/8 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between min-h-[450px] md:min-h-[520px]">
              
              {/* Top video feed badge & live status */}
              <div className="flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full neumorphic-inset text-[10px] text-[#E5A9A9] font-mono font-semibold tracking-widest uppercase">
                  <Sparkles className="w-3 h-3" /> Interview Room
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-red-400 font-bold tracking-wider uppercase">LIVE REC</span>
                </div>
              </div>

              {/* Liffy Speaking visualizer and frame */}
              <div className="flex-1 flex flex-col items-center justify-center relative my-6">
                {/* Backwards Glow behind Liffy when speaking */}
                <AnimatePresence>
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.12, scale: 1.1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.2,
                        ease: "easeInOut"
                      }}
                      className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#E5A9A9] to-red-400 blur-3xl pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Main Video Box holding Liffy */}
                <div className={`rounded-2xl border ${isSpeaking ? 'border-[#E5A9A9]/40 shadow-[0_0_40px_rgba(229,169,169,0.15)] bg-[#141414]' : 'border-white/10 bg-[#101010]'} overflow-hidden shadow-2xl relative flex items-center justify-center p-4 transition-all duration-500 ${
                  phase === 'coding_challenge' ? 'w-36 h-36 md:w-40 md:h-40' : 'w-64 h-64 md:w-80 md:h-80'
                }`}>
                  <img
                    src={isMouthOpen ? "/images/liffyopen.png" : "/images/liffyclose.png"}
                    alt="Liffy Interviewer"
                    className="w-full h-full object-contain select-none"
                  />
                  {isSpeaking && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-[#E5A9A9]/25 animate-pulse pointer-events-none" />
                  )}
                </div>

                {/* Animated speaking audio waves Overlay */}
                {isSpeaking && (
                  <div className={`absolute flex gap-1 justify-center items-center h-8 bg-[#0F0F0F]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 shadow-lg ${
                    phase === 'coding_challenge' ? 'bottom-0' : 'bottom-4'
                  }`}>
                    {[1, 2.5, 1.8, 3.2, 2.2, 2.8, 1.2].map((scale, i) => (
                      <motion.div
                        key={i}
                        animate={{ scaleY: [1, scale, 1] }}
                        transition={{ duration: 0.4 + i * 0.04, repeat: Infinity }}
                        className="w-[2px] h-3 bg-[#E5A9A9] origin-center rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Coding Problem Instructions (Left Column scrollable details) */}
              {phase === 'coding_challenge' && (
                <div className="border-t border-white/5 pt-4 mb-4 flex-1 flex flex-col min-h-0 text-left">
                  <h3 className="font-display font-black text-sm md:text-base text-white mb-2 uppercase tracking-wide">
                    {codingQuestion?.title || "Problem Description"}
                  </h3>
                  <div className="flex-1 overflow-y-auto max-h-[160px] md:max-h-[200px] pr-2 text-xs md:text-sm text-white/80 leading-relaxed font-sans scrollbar-thin">
                    <p className="whitespace-pre-line">{codingQuestion?.description}</p>
                  </div>
                </div>
              )}

              {/* Character Details & System Status */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between z-10">
                <div>
                  <h3 className="font-display font-black text-base md:text-lg tracking-wide text-white">LIFFY</h3>
                  <p className="text-[10px] font-mono text-[#E5A9A9] tracking-widest uppercase">AI Interviewer • Speaking</p>
                </div>
                <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  Secure Connection
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN: Interaction Panel ── */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="glassmorphic-card rounded-3xl p-8 md:p-10 border border-white/8 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between min-h-[450px]">
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
                <div className="inline-flex items-center gap-1.5 text-xs text-[#E5A9A9] font-mono font-semibold tracking-wider uppercase">
                  {phase === 'evaluating' ? 'Finishing session' : 'Interview Control'}
                </div>
                {phase !== 'intro' && phase !== 'evaluating' && (
                  <span className="text-xs font-mono text-text-secondary">
                    Question {currentQuestionIdx + 1} of {questions.length}
                  </span>
                )}
              </div>

              {/* Interactive Screen Phases */}
              <div className="flex-1 flex flex-col justify-center">
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
                      <h3 className="text-base font-sans font-bold text-white">Analyzing your response...</h3>
                      <p className="text-xs font-mono text-text-secondary/70">
                        Liffy is processing your answer for the follow-up question.
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
                      <h3 className="text-base font-sans font-bold text-white">Evaluating response...</h3>
                      <p className="text-xs font-mono text-text-secondary/70">
                        Saving details and preparing the next stage.
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
                      {lastAnswerEmpty ? (
                        <div className="rounded-2xl p-5 border border-amber-500/10 bg-amber-500/5 text-amber-400/80 text-sm font-sans flex items-center justify-center gap-3">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <span>No response received. Proceeding to next question.</span>
                        </div>
                      ) : (
                        <div className="rounded-2xl p-5 border border-emerald-500/10 bg-emerald-500/5 text-emerald-400/80 text-sm font-sans flex items-center justify-center gap-3">
                          <Award className="w-5 h-5 shrink-0" />
                          <span>Answer saved successfully! Liffy is ready to proceed.</span>
                        </div>
                      )}

                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-4 rounded-xl font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <span>{isLastQuestion ? (codingQuestion ? 'Proceed to Coding Round' : 'Complete Interview') : 'Next Question'}</span>
                        <ArrowRight className="w-4.5 h-4.5" />
                      </button>
                    </motion.div>
                  )}

                  {/* ── PHASE 10: Coding Challenge Workspace ── */}
                  {phase === 'coding_challenge' && (() => {
                    const editorContent = (
                      <div className={
                        isFullscreen 
                          ? "fixed inset-0 z-50 bg-[#0A0A0C] p-8 flex flex-col text-left space-y-6 overflow-y-auto"
                          : "space-y-6 flex flex-col h-full text-left"
                      }>
                        {/* Language Selection & Header Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                          <div>
                            <h3 className="text-base font-display font-black text-white">Coding Assessment</h3>
                            <p className="text-[10px] font-mono text-[#E5A9A9] uppercase tracking-wider">
                              Practical Coding / Pseudo-Code
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <label className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Language:</label>
                              <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="bg-[#141414] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E5A9A9]/50 cursor-pointer font-mono"
                              >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="pseudocode">Pseudo Code</option>
                              </select>
                            </div>
                            
                            <button
                              onClick={() => setIsFullscreen(prev => !prev)}
                              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white transition-all cursor-pointer flex items-center justify-center"
                              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                            >
                              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Editor Tabs / Toolbar */}
                        <div className="flex items-center justify-between bg-[#141417] border border-white/5 border-b-0 rounded-t-xl px-4 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5 mr-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            </div>
                            
                            {/* Active Tab */}
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0B0B0C] border border-white/5 border-b-0 rounded-t-lg text-xs font-mono text-[#E5A9A9] font-semibold -mb-2.5 relative z-10">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                selectedLanguage === 'javascript' ? 'bg-yellow-400' :
                                selectedLanguage === 'python' ? 'bg-blue-400' :
                                selectedLanguage === 'cpp' ? 'bg-sky-400' :
                                selectedLanguage === 'java' ? 'bg-orange-400' : 'bg-purple-400'
                              }`} />
                              {selectedLanguage === 'javascript' ? 'solution.js' :
                               selectedLanguage === 'python' ? 'solution.py' :
                               selectedLanguage === 'cpp' ? 'solution.cpp' :
                               selectedLanguage === 'java' ? 'Solution.java' : 'solution.pseudo'}
                            </div>
                          </div>
                          
                          <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest hidden sm:block">
                            Autosaved
                          </div>
                        </div>

                        {/* Code Editor Container */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex rounded-b-xl overflow-hidden border border-white/5 focus-within:border-[#E5A9A9]/30 bg-[#0B0B0C] relative">
                            {/* Line numbers column */}
                            <pre 
                              ref={lineNumbersRef}
                              className={`p-4 pr-2 text-right font-mono text-xs md:text-sm text-white/20 select-none bg-[#080809] border-r border-white/5 leading-relaxed min-w-[3.5rem] overflow-hidden ${
                                isFullscreen ? 'h-[calc(100vh-280px)] min-h-[400px]' : 'h-[300px] md:h-[350px]'
                              }`}
                            >
                              {Array.from({ length: Math.max(codeContent.split('\n').length, 1) }, (_, i) => i + 1).join('\n')}
                            </pre>
                            {/* Textarea + Syntax Highlight Wrapper */}
                            <div className={`flex-1 relative ${
                              isFullscreen ? 'h-[calc(100vh-280px)] min-h-[400px]' : 'h-[300px] md:h-[350px]'
                            }`}>
                              {/* Syntax Highlight overlay */}
                              <pre
                                ref={highlightOverlayRef}
                                className="absolute inset-0 m-0 p-4 font-mono text-xs md:text-sm text-white bg-transparent pointer-events-none overflow-hidden whitespace-pre-wrap break-all leading-relaxed border border-transparent select-none z-0"
                                dangerouslySetInnerHTML={{ __html: highlightCode(codeContent, selectedLanguage) }}
                              />
                              {/* Real Textarea */}
                              <textarea
                                ref={textareaRef}
                                value={codeContent}
                                onChange={(e) => handleCodeChange(e.target.value)}
                                onScroll={handleEditorScroll}
                                onKeyDown={handleKeyDown}
                                className="absolute inset-0 w-full h-full p-4 font-mono text-xs md:text-sm text-transparent caret-white bg-transparent focus:outline-none resize-none leading-relaxed overflow-y-auto whitespace-pre-wrap break-all border border-transparent z-10"
                                spellCheck="false"
                                placeholder={
                                  selectedLanguage === 'pseudocode' 
                                  ? "// Describe your logic, steps, or algorithm pseudocode here..."
                                  : `// Write your ${selectedLanguage} solution here...`
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-3 pt-2">
                          <button
                            onClick={() => handleCodeChange('')}
                            className="px-4 py-2.5 rounded-lg border border-white/8 hover:border-white/15 text-xs font-mono font-bold tracking-wider text-text-secondary hover:text-white transition-all cursor-pointer"
                          >
                            Clear Editor
                          </button>
                          <button
                            onClick={submitCodingSolution}
                            className="px-6 py-3 rounded-lg font-sans font-bold text-slate-950 gradient-primary hover:opacity-90 transition-all duration-300 shadow-md cursor-pointer"
                          >
                            Submit Solution
                          </button>
                        </div>
                      </div>
                    );

                    return (
                      <motion.div
                        key="coding-challenge"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className={isFullscreen ? "" : "h-full flex flex-col"}
                      >
                        {isFullscreen ? createPortal(editorContent, document.body) : editorContent}
                      </motion.div>
                    );
                  })()}

                  {/* ── PHASE 11: Submitting Coding Answer Loader ── */}
                  {phase === 'submitting_coding_answer' && (
                    <motion.div
                      key="submitting-coding"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10 space-y-4"
                    >
                      <Loader2 className="w-10 h-10 text-[#E5A9A9] animate-spin mx-auto" />
                      <h3 className="text-base font-sans font-bold text-white">Analyzing your solution...</h3>
                      <p className="text-xs font-mono text-text-secondary/70">
                        Evaluating code structure, complexity, and logic patterns.
                      </p>
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
              </div>

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
          </div>
        </div>
      </motion.div>
    </div>
  );
}
