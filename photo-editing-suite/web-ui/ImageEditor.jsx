import React, { useState, useRef, useEffect } from 'react';

export default function ImageEditor() {
  const [imageSrc, setImageSrc] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);
    };
  }, [imageSrc, brightness, contrast, saturation]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Image Editor</h2>
      <div className="mb-4 text-center">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="block mx-auto" />
      </div>
      {imageSrc ? (
        <>
          <canvas ref={canvasRef} className="mx-auto block rounded-md shadow-md" />
          <img ref={imageRef} src={imageSrc} alt="Source" className="hidden" />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="brightness" className="block font-semibold mb-1">Brightness</label>
              <input
                id="brightness"
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="contrast" className="block font-semibold mb-1">Contrast</label>
              <input
                id="contrast"
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="saturation" className="block font-semibold mb-1">Saturation</label>
              <input
                id="saturation"
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-6">Upload an image to start editing.</p>
      )}
    </div>
  );
}
