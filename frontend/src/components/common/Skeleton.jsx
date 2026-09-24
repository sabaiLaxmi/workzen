import React from 'react';
import './Skeleton.css';

export default function Skeleton({ width = '100%', height = '1rem', style = {}, className = '' }) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        ...style
      }}
    ></div>
  );
}
