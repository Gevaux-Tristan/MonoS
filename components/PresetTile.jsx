import React, { memo } from 'react';
import './PresetTile.css';

const PresetTile = memo(({ preset, isSelected, onSelect }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onSelect(preset);
  };

  return (
    <button
      className={`preset-tile ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      type="button"
      aria-label={`Select ${preset.name} preset`}
      aria-pressed={isSelected}
    >
      <div className="preset-content">
        <div 
          className="color-swatch"
          style={{ backgroundColor: preset.color }}
          aria-hidden="true"
        />
        <span className="preset-name">{preset.name}</span>
      </div>
    </button>
  );
});

PresetTile.displayName = 'PresetTile';
export default PresetTile; 