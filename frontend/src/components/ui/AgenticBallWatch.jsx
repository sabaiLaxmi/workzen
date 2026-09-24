import React from 'react';

export default function AgenticBallWatch() {
  return (
    <div className="relative w-[320px] h-[320px] flex items-center justify-center">
      {/* Glow / Swirl Orb Background */}
      <div className="absolute inset-0 rounded-full animate-spin-slow" style={{ animationDuration: '8s' }}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1E3A34] via-[#D4AF37] to-[#1E3A34] opacity-50 blur-2xl animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-bl from-[var(--pine)] to-[var(--ochre)] opacity-80 mix-blend-screen blur-xl"></div>
        <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,_var(--paper)_0%,_transparent_70%)] opacity-90 blur-md"></div>
      </div>

      {/* Solid Orb Core */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[var(--paper)] to-[var(--paper-raised)] shadow-[inset_0_-10px_30px_rgba(0,0,0,0.1),_0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Swirl accents inside the ball */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--pine)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--ochre)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* The Watch Overlaid */}
      <svg width="320" height="320" viewBox="0 0 320 320" className="hero-svg absolute z-10">
        <circle cx="160" cy="160" r="140" stroke="rgba(0,0,0,0.05)" strokeWidth="16" fill="none" />
        <circle 
          cx="160" cy="160" r="140" 
          stroke="var(--pine)" strokeWidth="16" fill="none" strokeLinecap="round"
          className="hero-ring-progress drop-shadow-md"
        />
        {/* Ticking Hand */}
        <line 
          x1="160" y1="160" x2="160" y2="80" 
          stroke="var(--ochre)" strokeWidth="12" strokeLinecap="round" 
          className="drop-shadow-md"
          style={{
            transformOrigin: '160px 160px',
            animation: 'spin 60s steps(60, end) infinite'
          }}
        />
        {/* Hour Hand */}
        <line 
          x1="160" y1="160" x2="195" y2="195" 
          stroke="var(--ochre)" strokeWidth="12" strokeLinecap="round" 
          className="drop-shadow-md"
          style={{
            transformOrigin: '160px 160px',
            animation: 'spin 43200s linear infinite'
          }}
        />
        
        {/* Center dot for watch */}
        <circle cx="160" cy="160" r="8" fill="var(--ink)" />
      </svg>
    </div>
  );
}
