import React, { useState } from 'react';
import TVApp from './TVApp';

function App() {
  const [mode, setMode] = useState(null);

  if (mode === 'tv') {
    return <TVApp />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-10">Bienvenido a MT Media</h1>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="cursor-pointer" onClick={() => setMode('tv')}>
          <img src="/static/tv.png" alt="TV" className="w-64 h-40 object-cover rounded-lg shadow-lg hover:scale-105 transition" />
          <p className="text-center mt-2 font-semibold text-lg">TV</p>
        </div>
        <div className="cursor-pointer" onClick={() => setMode('movies')}>
          <img src="/static/movies.png" alt="Películas & Series" className="w-64 h-40 object-cover rounded-lg shadow-lg hover:scale-105 transition" />
          <p className="text-center mt-2 font-semibold text-lg">Películas & Series</p>
        </div>
      </div>
    </div>
  );
}

export default App;
