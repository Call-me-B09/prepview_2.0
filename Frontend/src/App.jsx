import React, { useState, useEffect } from 'react';
import { auth, signOut } from './firebase.js';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PreviousSessions from './components/PreviousSessions';
import NewInterview from './components/NewInterview';
import ActiveInterview from './components/ActiveInterview';

export default function App() {
  // Views: 'landing' | 'login' | 'dashboard' | 'sessions' | 'new-interview' | 'active-interview'
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSessionData, setActiveSessionData] = useState(null);

  // Load session from localStorage on initial render
  useEffect(() => {
    const session = localStorage.getItem('prepview_current_user');
    if (session) {
      const user = JSON.parse(session);
      setCurrentUser(user);
      // If already logged in, go straight to dashboard
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase signOut failed:", err);
    }
    localStorage.removeItem('prepview_current_user');
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleInterviewStart = (sessionData) => {
    setActiveSessionData(sessionData);
    setCurrentView('active-interview');
  };

  // --- Login view ---
  if (currentView === 'login') {
    return (
      <Login
        onClose={() => setCurrentView('landing')}
        onLoginSuccess={handleLoginSuccess}
        onNavigate={setCurrentView}
      />
    );
  }

  // --- Dashboard (post-login home) ---
  if (currentView === 'dashboard' && currentUser) {
    return (
      <>
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigate={setCurrentView}
        />
        <Dashboard currentUser={currentUser} onNavigate={setCurrentView} />
      </>
    );
  }

  // --- Previous Sessions view ---
  if (currentView === 'sessions' && currentUser) {
    return (
      <>
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigate={setCurrentView}
        />
        <PreviousSessions currentUser={currentUser} onNavigate={setCurrentView} />
      </>
    );
  }

  // --- New Interview view ---
  if (currentView === 'new-interview' && currentUser) {
    return (
      <>
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigate={setCurrentView}
        />
        <NewInterview
          currentUser={currentUser}
          onNavigate={setCurrentView}
          onInterviewStart={handleInterviewStart}
        />
      </>
    );
  }

  // --- Active Interview view ---
  if (currentView === 'active-interview' && currentUser && activeSessionData) {
    return (
      <>
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigate={setCurrentView}
        />
        <ActiveInterview
          currentUser={currentUser}
          sessionData={activeSessionData}
          onNavigate={setCurrentView}
        />
      </>
    );
  }

  // --- Landing page (default) ---
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#E5A9A9] selection:text-[#0A0A0A] overflow-x-hidden relative grid-bg">
      {/* Classy Ambient Glowing Meshes */}
      <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-white/2 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E5A9A9]/2 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[25%] left-[-5%] w-[600px] h-[600px] rounded-full bg-white/1.5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[5%] right-[5%] w-[450px] h-[450px] rounded-full bg-[#E5A9A9]/2.5 blur-[120px] pointer-events-none z-0" />

      {/* Structural layout lines: Swiss Style (classy border dividers running down the page) */}
      <div className="absolute left-[8%] right-[8%] top-0 bottom-0 border-l border-r border-swiss-grid-border/30 pointer-events-none z-0 hidden lg:block" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-swiss-grid-border/15 pointer-events-none z-0 hidden xl:block" />

      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={setCurrentView}
      />
      <main className="flex-grow relative z-10">
        <Hero
          currentUser={currentUser}
          onNavigate={setCurrentView}
        />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
