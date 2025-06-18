import React, { useRef, useCallback, memo } from 'react';
import './CursorControl.css';

const CursorControl = memo(({ onValueChange, value, min = 0, max = 100 }) => {
  const containerRef = useRef(null);
  const sphereRef = useRef(null);
  const isDragging = useRef(false);

  const handleSphereMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleSphereTouchStart = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = min + (max - min) * x;
    onValueChange(newValue);
  }, [min, max, onValueChange]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const newValue = min + (max - min) * x;
    onValueChange(newValue);
  }, [min, max, onValueChange]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const normalizedValue = (value - min) / (max - min);
  const spherePosition = `${normalizedValue * 100}%`;

  return (
    <div 
      ref={containerRef}
      className="cursor-control"
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label="Adjust value"
    >
      <div className="cursor-track">
        <div 
          className="cursor-sphere"
          ref={sphereRef}
          style={{ left: spherePosition }}
          onMouseDown={handleSphereMouseDown}
          onTouchStart={handleSphereTouchStart}
          role="presentation"
        />
      </div>
    </div>
  );
});

CursorControl.displayName = 'CursorControl';
export default CursorControl; 