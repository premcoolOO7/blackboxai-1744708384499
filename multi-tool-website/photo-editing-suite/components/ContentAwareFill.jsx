import React from 'react';

export default function ContentAwareFill() {
  return (
    <div className="p-6 rounded-xl shadow-lg max-w-3xl mx-auto bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 text-gray-900 font-sans">
      <h3 className="text-2xl font-bold mb-4 text-center text-white drop-shadow-md">Content-Aware Fill</h3>
      <p className="mb-2 text-white text-center">
        Remove unwanted objects from photos seamlessly using content-aware fill.
      </p>
      <p className="mb-6 text-white text-center">Integration with AI backend coming soon.</p>
      <div className="flex justify-center">
        <button
          className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full shadow hover:bg-indigo-600 hover:text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 cursor-not-allowed"
          disabled
          aria-disabled="true"
          aria-label="Upload Image and Remove Object (Coming Soon)"
        >
          <i className="fas fa-eraser"></i> Upload Image & Remove Object (Coming Soon)
        </button>
      </div>
    </div>
  );
}
