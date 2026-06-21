import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "It helped me practice speaking clearly and keeping my answers structured. Very useful for getting reps in."
    },
    {
      quote: "The interface is straightforward. It really helped me reduce my verbal filler words like 'like' and 'uhm' during mock sessions."
    },
    {
      quote: "A simple way to run through standard questions for my role. The AI generated realistic follow-ups based on what I said."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500); // changes card every 4.5 seconds
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-32 bg-[#0A0A0A] relative z-10 border-b border-swiss-grid-border">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
          <div className="lg:col-span-8">
            <span className="font-mono text-xs text-[#E5A9A9] uppercase font-bold tracking-widest block mb-4">
              Candidate Feedback
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-none">
              Straightforward practice, <br />
              real improvement.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-sm font-sans font-medium text-text-secondary leading-relaxed">
              Read direct feedback from candidates who used PrepView to prepare for their upcoming conversations.
            </p>
          </div>
        </div>

        {/* Testimonials Auto-changing Card */}
        <div className="flex flex-col items-center justify-center min-h-[280px]">
          <div className="w-full max-w-2xl relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="neumorphic-flat rounded-2xl p-10 flex flex-col justify-between gap-8 border border-swiss-grid-border relative group min-h-[200px]"
              >
                <div className="flex flex-col gap-6">
                  {/* Stars and Icon Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <MessageSquare className="w-5 h-5 text-text-secondary/30" />
                  </div>

                  {/* Quote */}
                  <p className="text-base md:text-lg font-sans text-white/90 leading-relaxed italic">
                    "{testimonials[currentIndex].quote}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx 
                      ? 'bg-[#E5A9A9] w-6' 
                      : 'bg-swiss-grid-border hover:bg-white/30'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
