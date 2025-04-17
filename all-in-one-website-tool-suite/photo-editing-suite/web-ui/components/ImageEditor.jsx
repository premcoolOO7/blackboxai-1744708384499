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
    <div className="p-6 rounded-xl shadow-lg max-w-3xl mx-auto bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-gray-900 font-sans">
      <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-md">Professional Image Editor</h2>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer mb-6"
        aria-label="Upload an image to edit"
      />
      {imageSrc && (
        <div>
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={rotateLeft}
              className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded-full shadow hover:bg-indigo-600 hover:text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
              aria-label="Rotate image left"
            >
              <i className="fas fa-undo-alt"></i> Rotate Left
            </button>
            <button
              onClick={rotateRight}
              className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded-full shadow hover:bg-indigo-600 hover:text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
              aria-label="Rotate image right"
            >
              <i className="fas fa-redo-alt"></i> Rotate Right
            </button>
            <button
              onClick={zoomOut}
              className="bg-white text-indigo-500 font-semibold py-2 px-4 rounded-full shadow hover:bg-indigo-500 hover:text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-200"
              aria-label="Zoom out"
            >
              <i className="fas fa-search-minus"></i> Zoom Out
            </button>
            <button
              onClick={zoomIn}
              className="bg-white text-indigo-500 font-semibold py-2 px-4 rounded-full shadow hover:bg-indigo-500 hover:text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-200"
              aria-label="Zoom in"
            >
              <i className="fas fa-search-plus"></i> Zoom In
            </button>
          </div>
          <div className="mb-6 max-w-sm mx-auto space-y-6">
            <label className="block">
              <span className="text-white font-semibold mb-1 block">Brightness: {brightness}%</span>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={onBrightnessChange}
                className="w-full accent-indigo-600"
                aria-label="Adjust brightness"
              />
            </label>
            <label className="block">
              <span className="text-white font-semibold mb-1 block">Contrast: {contrast}%</span>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={onContrastChange}
                className="w-full accent-indigo-600"
                aria-label="Adjust contrast"
              />
            </label>
          </div>
          <div className="border-4 border-white rounded-lg p-2 max-w-full max-h-[400px] overflow-auto shadow-lg bg-white">
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
                borderRadius: '0.5rem',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
