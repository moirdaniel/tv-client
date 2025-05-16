// tv-client App mejorado con menú flotante, cierre central, scroll estilizado y logo/nombre arriba
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { FiMenu } from 'react-icons/fi';

function TVApp() {
  const [channels, setChannels] = useState([]);
  const [selected, setSelected] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [showError, setShowError] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetch('https://api-tv.moir.cl/api/channels')
      .then(res => res.json())
      .then(data => {
        const active = data.filter(c => c.enabled);
        setChannels(active);
        if (active.length > 0) setSelected(active[0]);
      });
  }, []);

  const handleInteraction = () => {
    if (!menuVisible) return;
    clearTimeout(timeoutRef.current);
    setShowCloseButton(true);
    timeoutRef.current = setTimeout(() => {
      setShowCloseButton(false);
    }, 60000);
  };

  useEffect(() => {
    if (menuVisible) {
      window.addEventListener('mousemove', handleInteraction);
    } else {
      window.removeEventListener('mousemove', handleInteraction);
    }
    return () => window.removeEventListener('mousemove', handleInteraction);
  }, [menuVisible]);

  const handlePlayError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <ReactPlayer
        url={selected?.url}
        playing
        controls
        width="100%"
        height="100vh"
        onError={handlePlayError}
      />

      {/* Logo y nombre del canal */}
      {selected && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 flex items-center space-x-2 rounded">
          <img src={selected.logoUrl} className="h-6" />
          <span className="text-sm font-semibold">{selected.name}</span>
        </div>
      )}

      {/* Mensaje de error */}
      {showError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className="bg-red-600 text-white px-4 py-2 rounded shadow-lg text-lg font-semibold">
            Canal fuera de servicio
          </div>
        </div>
      )}

      {/* Botón cerrar flotante arriba */}
      {menuVisible && showCloseButton && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={() => setMenuVisible(false)}
            className="bg-red-600 px-4 py-2 rounded text-white shadow-lg"
          >
            Cerrar menú
          </button>
        </div>
      )}

      {/* Menú lateral */}
      {menuVisible && (
        <div className="absolute top-0 left-0 w-64 h-full bg-black bg-opacity-90 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent z-20">
          <div className="p-4">
            <h2 className="text-xl mb-2">Canales</h2>
            {channels.map((ch) => (
              <div
                key={ch.id}
                className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${selected?.id === ch.id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                onClick={() => setSelected(ch)}
              >
                <img src={ch.logoUrl} className="w-8 h-6 object-contain" />
                <span>{ch.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón hamburguesa */}
      {!menuVisible && (
        <div className="absolute top-2 left-2 z-30">
          <button
            className="bg-gray-900 text-white p-2 rounded"
            onClick={() => setMenuVisible(true)}
          >
            <FiMenu size={20} />
          </button>
        </div>
      )}

      {/* Pie de controles */}
      {!menuVisible && (
        <div className="absolute bottom-4 w-full flex flex-col items-center z-20">
          <span className="text-white mb-2">Canales</span>
          <button
            onClick={() => setMenuVisible(true)}
            className="bg-white text-black px-4 py-2 rounded shadow"
          >
            Mostrar Menú
          </button>
        </div>
      )}
    </div>
  );
}

export default TVApp;
