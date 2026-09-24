import { useEffect, useState } from 'react';

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let fadeTimer;

    const handleStart = () => {
      setVisible(true);
      setProgress(0);
      
      // Animate from 0 to 80% quickly
      setTimeout(() => {
        setProgress(80);
      }, 50);
    };

    const handleEnd = () => {
      setProgress(100);
      
      // Fade out after a short delay so the 100% state is visible
      fadeTimer = setTimeout(() => {
        setVisible(false);
        // Reset progress silently after fade completes
        setTimeout(() => setProgress(0), 200);
      }, 300);
    };

    window.addEventListener('api-request-start', handleStart);
    window.addEventListener('api-request-end', handleEnd);

    return () => {
      window.removeEventListener('api-request-start', handleStart);
      window.removeEventListener('api-request-end', handleEnd);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '3px',
      zIndex: 9999,
      backgroundColor: 'transparent',
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'opacity 200ms ease'
    }}>
      <div style={{
        height: '100%',
        backgroundColor: 'var(--pine)',
        width: `${progress}%`,
        transition: progress === 100 
          ? 'width 200ms ease-out' 
          : 'width 400ms cubic-bezier(0.1, 0.8, 0.3, 1)'
      }}></div>
    </div>
  );
}
