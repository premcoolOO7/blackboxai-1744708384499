import React, { useState, useRef } from 'react';

export default function ImageEditor() {
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
                transform: `rotate(${rotation}deg) scale(${scale})`,
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
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
