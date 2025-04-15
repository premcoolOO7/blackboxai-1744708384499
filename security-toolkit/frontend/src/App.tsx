import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isRegister, setIsRegister] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const endpoint = isRegister ? '/register' : '/login';
    try {
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || 'Error occurred');
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Security Toolkit Authentication</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="username" className="block font-semibold mb-1">Username</label>
          <input
            id="username"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block font-semibold mb-1">Password</label>
          <input
            id="password"
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <button
        onClick={() => {
          setIsRegister(!isRegister);
          setMessage('');
        }}
        className="mt-4 text-blue-600 underline"
      >
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}

export default App;
