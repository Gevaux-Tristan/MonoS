const isMobile = window.innerWidth <= 768;
const swatchSize = isMobile ? 20 : 40;

interface FilmPresetsProps {
  presets: Array<{ name: string; color: string }>;
  selectedPreset: string;
  onSelectPreset: (name: string) => void;
}

const FilmPresets: React.FC<FilmPresetsProps> = (props) => {
  const { presets, selectedPreset, onSelectPreset } = props;

  return (
    <div>
      {isMobile && (
        <button
          onClick={() => {
            // Add your take picture logic here
            console.log('Take a picture');
          }}
          style={{
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Take a Picture
        </button>
      )}
      {presets.map((preset: { name: string; color: string }) => (
        <div
          key={preset.name}
          className={`preset ${selectedPreset === preset.name ? 'selected' : ''}`}
          onClick={() => onSelectPreset(preset.name)}
          style={{ cursor: 'pointer' }}
        >
          <div
            className="color-swatch"
            style={{
              backgroundColor: preset.color,
              width: `${swatchSize}px`,
              height: `${swatchSize}px`,
              borderRadius: '50%',
              marginRight: '10px',
            }}
          />
          <span>{preset.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FilmPresets; 