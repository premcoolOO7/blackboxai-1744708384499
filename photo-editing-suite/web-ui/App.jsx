import React, { useState, useRef } from 'react';

const features = [
  { id: 'basic', name: 'Basic Tools', description: 'Crop, rotate, resize, exposure/contrast, color correction' },
  { id: 'retouching', name: 'Retouching', description: 'Blemish removal, clone stamp, content-aware fill, red-eye correction' },
  { id: 'advanced', name: 'Advanced Editing', description: 'Layer/mask support, curves/levels, selective adjustments, liquify' },
  { id: 'ai', name: 'AI Automation', description: 'Auto-enhance, sky replacement, object removal, portrait retouching' },
  { id: 'creative', name: 'Creative Effects', description: 'Presets/filters, double exposure, HDR merge, text/overlay tools' },
  { id: 'workflow', name: 'Workflow', description: 'Batch processing, history panel, non-destructive editing, cloud sync' },
  { id: 'output', name: 'Output', description: 'Format conversion, metadata editing, social media templates, watermarking' },
];

function BasicTools() {
  const [imageSrc, setImageSrc] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const imgRef = useRef(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setRotation(0);
      setScale(1);
      setBrightness(100);
      setContrast(100);
    }
  };

  const rotateLeft = () => setRotation((r) => r - 90);
  const rotateRight = () => setRotation((r) => r + 90);
  const zoomIn = () => setScale((s) => Math.min(s + 0.1, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.1, 0.1));
  const onBrightnessChange = (e) => setBrightness(e.target.value);
  const onContrastChange = (e) => setContrast(e.target.value);

  return (
    <div>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {imageSrc && (
        <div className="mt-4">
          <div className="mb-2 flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={rotateLeft}>Rotate Left</button>
            <button className="btn btn-primary" onClick={rotateRight}>Rotate Right</button>
            <button className="btn btn-secondary" onClick={zoomOut}>Zoom Out</button>
            <button className="btn btn-secondary" onClick={zoomIn}>Zoom In</button>
          </div>
          <div className="mb-4 flex flex-col max-w-sm gap-4">
            <label>
              Brightness: {brightness}%
              <input type="range" min="0" max="200" value={brightness} onChange={onBrightnessChange} />
            </label>
            <label>
              Contrast: {contrast}%
              <input type="range" min="0" max="200" value={contrast} onChange={onContrastChange} />
            </label>
          </div>
          <div className="border p-2 inline-block max-w-full max-h-[400px] overflow-auto">
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Uploaded"
              style={{
                transform: \`rotate(\${rotation}deg) scale(\${scale})\`,
                filter: \`brightness(\${brightness}%) contrast(\${contrast}%)\`,
                maxWidth: '100%',
                maxHeight: '400px',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PlaceholderFeature({ name }) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-300 rounded">
      <p>{name} tools UI will be implemented here.</p>
      <p>Feature integration with AI and editing modules coming soon.</p>
    </div>
  );
}

function App() {
  const [selectedFeature, setSelectedFeature] = useState(features[0].id);

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-md p-4 overflow-y-auto">
        <h1 className="text-xl font-bold mb-6">PhotoMaster Pro</h1>
        <ul>
          {features.map(feature => (
            <li key={feature.id} className={\`mb-3 cursor-pointer p-2 rounded \${selectedFeature === feature.id ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}\`}
              onClick={() => setSelectedFeature(feature.id)}>
              {feature.name}
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">{features.find(f => f.id === selectedFeature).name}</h2>
        <p className="mb-6">{features.find(f => f.id === selectedFeature).description}</p>
        <div className="bg-white p-4 rounded shadow min-h-[400px]">
          {selectedFeature === 'basic' ? <BasicTools /> : <PlaceholderFeature name={features.find(f => f.id === selectedFeature).name} />}
        </div>
      </main>
    </div>
  );
}

export default App;
