import React, { useState, useEffect, useRef } from 'react';
import LiquifyTool from './components/LiquifyTool';
import CloneStampTool from './components/CloneStampTool';
import FrequencySeparationTool from './components/FrequencySeparationTool';
import ResynthesizerTool from './components/ResynthesizerTool';
import WarpTransformTool from './components/WarpTransformTool';
import FaceDetectionTool from './components/FaceDetectionTool';
import AIPortraitEnhancer from './components/AIPortraitEnhancer';

const tools = {
  Liquify: LiquifyTool,
  'Clone Stamp': CloneStampTool,
  'Frequency Separation': FrequencySeparationTool,
  Resynthesizer: ResynthesizerTool,
  'Warp Transform': WarpTransformTool,
  'Face Detection': FaceDetectionTool,
  'AI Portrait Enhancer': AIPortraitEnhancer,
};

export default function PhotoEditor() {
  const [selectedTool, setSelectedTool] = useState('Liquify');
  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  // Handler to load image file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  // Clear object URL on unmount or imageSrc change
  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const ToolComponent = tools[selectedTool];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <header className="bg-purple-800 p-4 text-center text-white font-bold text-2xl select-none">
        AI-Powered Photo Editing Suite
      </header>
      <div className="flex flex-grow max-w-7xl mx-auto p-4 gap-4">
        <aside className="w-64 bg-gray-800 rounded-lg p-4 flex flex-col gap-3 shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-purple-300 select-none">Tools</h2>
          <button
            className="mb-4 bg-purple-700 text-white rounded px-3 py-2 text-center cursor-pointer"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Load Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {Object.keys(tools).map((tool) => (
            <button
              key={tool}
              className={`text-left px-3 py-2 rounded hover:bg-purple-700 focus:bg-purple-700 focus:outline-none ${
                selectedTool === tool ? 'bg-purple-700 font-semibold' : ''
              }`}
              onClick={() => setSelectedTool(tool)}
            >
              {tool}
            </button>
          ))}
        </aside>
        <main className="flex-grow bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 select-none">{selectedTool}</h2>
          <div className="flex-grow overflow-auto bg-gray-900 rounded-lg p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-grow md:w-1/2 flex justify-center items-center bg-black rounded-lg p-2">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Loaded for editing"
                  className="max-w-full max-h-full rounded-lg"
                />
              ) : (
                <p className="text-gray-500 italic">Load an image to start editing</p>
              )}
            </div>
            <div className="flex-grow md:w-1/2 overflow-auto">
              <ToolComponent imageSrc={imageSrc} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
