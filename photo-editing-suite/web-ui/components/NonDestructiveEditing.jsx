import React from 'react';

export default function NonDestructiveEditing() {
  return (
    <div className="p-6 rounded-xl shadow-lg max-w-3xl mx-auto bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 text-gray-900 font-sans">
      <h3 className="text-2xl font-bold mb-4 text-center text-white drop-shadow-md">Non-Destructive Editing</h3>
      <p className="mb-2 text-white text-center">
        Supports layers, masks, and history for non-destructive photo editing.
      </p>
      <p className="mb-6 text-white text-center">Feature development in progress.</p>
      <div className="flex justify-center">
        <button
          className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full shadow hover:bg-indigo-600 hover:text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 cursor-not-allowed"
          disabled
          aria-disabled="true"
          aria-label="Open Editor (Coming Soon)"
        >
          <i className="fas fa-layer-group"></i> Open Editor (Coming Soon)
        </button>
      </div>
    </div>
  );
}
