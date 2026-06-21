import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-swiss-grid-border relative z-10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-swiss-grid-border/40">
          
          {/* Logo & Description */}
          <div className="md:col-span-5 flex flex-col gap-4 items-start">
            <a href="#" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="PrepView Logo"
                className="w-14 h-14 object-contain translate-y-1"
              />
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                PrepView <span className="text-[#E5A9A9] font-medium">2.0</span>
              </span>
            </a>
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              State-of-the-art AI-powered mock interview workspace designed to build confidence, polish delivery, and optimize resume-role alignment.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[10px] font-mono text-[#E5A9A9] uppercase font-bold tracking-wider">
              Product Links
            </span>
            <div className="flex flex-col gap-2.5">
              <a href="#features" className="text-xs font-sans font-medium text-text-secondary hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-xs font-sans font-medium text-text-secondary hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="text-xs font-sans font-medium text-text-secondary hover:text-white transition-colors">Testimonials</a>
            </div>
          </div>

          {/* Company links */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-[10px] font-mono text-[#E5A9A9] uppercase font-bold tracking-wider">
              Resources
            </span>
            <div className="flex flex-col gap-2.5">
              <a href="#about" className="text-xs font-sans font-medium text-text-secondary hover:text-white transition-colors">About Us</a>
              <a href="#blog" className="text-xs font-sans font-medium text-text-secondary hover:text-white transition-colors">Interview Guide</a>
              <a href="#careers" className="text-xs font-sans font-medium text-text-secondary hover:text-white transition-colors">Careers</a>
              <a href="#privacy" className="text-xs font-sans font-medium text-text-secondary hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>

          {/* Social connections */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-[10px] font-mono text-[#E5A9A9] uppercase font-bold tracking-wider">
              Connect
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                className="w-8 h-8 rounded-lg bg-surface border border-swiss-grid-border flex items-center justify-center text-text-secondary hover:text-white hover:border-white transition-all"
                aria-label="Twitter link"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                className="w-8 h-8 rounded-lg bg-surface border border-swiss-grid-border flex items-center justify-center text-text-secondary hover:text-white hover:border-white transition-all"
                aria-label="LinkedIn link"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                </svg>
              </a>
              <a
                href="https://github.com"
                className="w-8 h-8 rounded-lg bg-surface border border-swiss-grid-border flex items-center justify-center text-text-secondary hover:text-white hover:border-white transition-all"
                aria-label="GitHub link"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-[10px] font-mono text-text-secondary">
          <span>
            © {new Date().getFullYear()} PrepView. All rights reserved.
          </span>
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for high-performance builders.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
