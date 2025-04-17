import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setError('');
    setLoading(true);
    setGeneratedCode('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate code');
      }
      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (err) {
      setError(err.message || 'Error generating code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">AI Meta-Tool Platform Prototype</h1>
      <textarea
        className="w-full p-3 border border-gray-300 rounded mb-4"
        rows={6}
        placeholder="Describe the tool you want to build..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Tool'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {generatedCode && (
        <div className="mt-6 bg-white p-4 rounded shadow overflow-auto max-h-96">
          <pre className="whitespace-pre-wrap">{generatedCode}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
