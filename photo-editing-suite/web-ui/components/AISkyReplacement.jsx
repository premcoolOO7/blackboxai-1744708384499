import React from 'react';

export default function AISkyReplacement() {
  return (
    <div className="p-6 rounded-xl shadow-lg max-w-3xl mx-auto bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-gray-900 font-sans">
      <h3 className="text-2xl font-bold mb-4 text-center text-white drop-shadow-md">AI Sky Replacement</h3>
      <p className="mb-2 text-white text-center">
        This tool allows you to automatically replace the sky in your photos using AI.
      </p>
      <p className="mb-6 text-white text-center">Integration with AI backend coming soon.</p>
      <div className="flex justify-center">
        <button
          className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full shadow hover:bg-indigo-600 hover:text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 cursor-not-allowed"
          disabled
          aria-disabled="true"
          aria-label="Upload Image and Replace Sky (Coming Soon)"
        >
          <i className="fas fa-cloud-sun"></i> Upload Image & Replace Sky (Coming Soon)
        </button>
      </div>
    </div>
  );
}
