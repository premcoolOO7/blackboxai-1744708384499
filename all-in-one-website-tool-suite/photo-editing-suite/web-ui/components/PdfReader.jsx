import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';

export default function PdfReader() {
  const [pdfText, setPdfText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
  }, []);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + ' ';
      }
      setPdfText(fullText);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const playText = () => {
    if (!speechSupported || !pdfText) return;
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(pdfText);
    utterance.onend = () => setIsPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const pauseText = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const resumeText = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const stopText = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="p-6 rounded-xl shadow-lg max-w-4xl mx-auto bg-white text-gray-900 font-sans">
      <h2 className="text-3xl font-bold mb-6 text-center">PDF Reader - Listen to Your Book</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer mb-6"
        aria-label="Upload PDF file"
      />
      {pdfText && (
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            {!isPlaying ? (
              <button
                onClick={playText}
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                aria-label="Play text to speech"
              >
                <i className="fas fa-play"></i> Play
              </button>
            ) : (
              <button
                onClick={pauseText}
                className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
                aria-label="Pause text to speech"
              >
                <i className="fas fa-pause"></i> Pause
              </button>
            )}
            <button
              onClick={resumeText}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              aria-label="Resume text to speech"
            >
              <i className="fas fa-play"></i> Resume
            </button>
            <button
              onClick={stopText}
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
              aria-label="Stop text to speech"
            >
              <i className="fas fa-stop"></i> Stop
            </button>
          </div>
          <textarea
            readOnly
            value={pdfText}
            className="w-full h-64 p-4 border border-gray-300 rounded resize-none"
            aria-label="PDF text content"
          />
        </div>
      )}
      {!speechSupported && (
        <p className="text-red-600 text-center mt-4">Sorry, your browser does not support speech synthesis.</p>
      )}
    </div>
  );
}
