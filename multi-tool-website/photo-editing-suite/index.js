const { useState } = React;
const { createRoot } = ReactDOM;

import ImageEditor from './components/ImageEditor.jsx';
import AISkyReplacement from './components/AISkyReplacement.jsx';
import NonDestructiveEditing from './components/NonDestructiveEditing.jsx';
import ContentAwareFill from './components/ContentAwareFill.jsx';

function App() {
  const [activeTool, setActiveTool] = useState('imageEditor');

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">PhotoMaster Pro - MultiTool</h1>
        <nav className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveTool('imageEditor')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeTool === 'imageEditor' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
            aria-current={activeTool === 'imageEditor' ? 'page' : undefined}
          >
            Image Editor
          </button>
          <button
            onClick={() => setActiveTool('aiSkyReplacement')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeTool === 'aiSkyReplacement' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
            aria-current={activeTool === 'aiSkyReplacement' ? 'page' : undefined}
          >
            AI Sky Replacement
          </button>
          <button
            onClick={() => setActiveTool('nonDestructiveEditing')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeTool === 'nonDestructiveEditing' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
            aria-current={activeTool === 'nonDestructiveEditing' ? 'page' : undefined}
          >
            Non-Destructive Editing
          </button>
          <button
            onClick={() => setActiveTool('contentAwareFill')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeTool === 'contentAwareFill' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
            aria-current={activeTool === 'contentAwareFill' ? 'page' : undefined}
          >
            Content-Aware Fill
          </button>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto">
        {activeTool === 'imageEditor' && <ImageEditor />}
        {activeTool === 'aiSkyReplacement' && <AISkyReplacement />}
        {activeTool === 'nonDestructiveEditing' && <NonDestructiveEditing />}
        {activeTool === 'contentAwareFill' && <ContentAwareFill />}
      </main>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
