import React, { useState, useEffect } from 'react';
import Skeleton from '../common/Skeleton';
import './OverviewBand.css';

export default function OverviewBand({ ringPercentage, ringCenterText, stats, loading }) {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [currentPercentage, setCurrentPercentage] = useState(0);

  useEffect(() => {
    if (loading) return;

    let targetNumber = 0;
    let suffix = ringCenterText;

    if (ringCenterText) {
      const targetNumberMatch = ringCenterText.match(/^(\d+)/);
      if (targetNumberMatch) {
        targetNumber = parseInt(targetNumberMatch[1], 10);
        suffix = ringCenterText.substring(targetNumberMatch[0].length);
      }
    }

    let startTimestamp = null;
    const duration = 1500; // 1.5 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCurrentNumber(Math.floor(easeProgress * targetNumber));
      setCurrentPercentage(easeProgress * ringPercentage);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [loading, ringPercentage, ringCenterText]);

  if (loading) {
    return (
      <div className="overview-band panel loading-band">
        <div className="overview-ring-container">
           <Skeleton width="160px" height="160px" style={{ borderRadius: '50%' }} />
        </div>
        <div className="overview-stats">
          {stats.map((_, i) => (
            <div key={i} className="overview-stat-item">
              <Skeleton width="60px" height="40px" style={{ marginBottom: '1rem' }} />
              <Skeleton width="100px" height="16px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Circumference of r=140 is ~880
  const offset = 880 - (880 * currentPercentage) / 100;

  // re-construct text
  let targetNumberMatch = null;
  let suffix = ringCenterText;
  
  if (ringCenterText) {
    targetNumberMatch = ringCenterText.match(/^(\d+)/);
    if (targetNumberMatch) {
      suffix = ringCenterText.substring(targetNumberMatch[0].length);
    }
  }

  return (
    <div className="overview-band panel">
      <div className="overview-ring-container">
        <svg width="160" height="160" viewBox="0 0 320 320" className="overview-svg">
          <circle cx="160" cy="160" r="140" stroke="var(--line)" strokeWidth="16" fill="none" />
          <circle 
            cx="160" cy="160" r="140" 
            stroke="var(--pine)" strokeWidth="16" fill="none" strokeLinecap="round"
            style={{ strokeDasharray: 880, strokeDashoffset: offset }}
            className="overview-ring-progress"
          />
        </svg>
        <div className="overview-ring-center" style={{ flexDirection: 'column' }}>
          {targetNumberMatch ? (
            <>
              <span className="mono" style={{ fontSize: '1.75rem', lineHeight: 1 }}>{currentNumber}</span>
              <span className="mono text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>{suffix.trim()}</span>
            </>
          ) : (
            <span className="mono">{ringCenterText}</span>
          )}
        </div>
      </div>
      
      <div className="overview-stats">
        {stats.map((stat, i) => (
          <div key={i} className="overview-stat-item">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
