import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons in react-leaflet when using Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ActiveTrip = ({ onBack }) => {
  const [routeData, setRouteData] = useState(null);
  const [tripStarted, setTripStarted] = useState(false);
  const navigate = useNavigate();

  const pickupLoc = [13.0622, 80.2524];
  const dropLoc = [13.0418, 80.2341];

  useEffect(() => {
    // Fetch route from OSRM
    fetch(`https://router.project-osrm.org/route/v1/driving/${pickupLoc[1]},${pickupLoc[0]};${dropLoc[1]},${dropLoc[0]}?overview=full&geometries=geojson`)
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          // GeoJSON coordinates are [lon, lat], leaflet needs [lat, lon]
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteData(coords);
        }
      })
      .catch(err => console.error("Error fetching OSRM route:", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-md pb-24 md:pb-0 w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-sm shrink-0">
        <div className="flex items-center gap-sm">
          <button 
            onClick={onBack} 
            className="p-1 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center justify-center border border-transparent hover:border-outline-variant hover:text-primary"
            title="Back to Dashboard"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-lg text-headline-lg text-on-background uppercase tracking-tight">ACTIVE TRIP</h1>
        </div>
        <div className="bg-secondary text-on-secondary px-3 py-1 rounded-sm font-label-sm uppercase flex items-center gap-2 border border-[#36B37E]">
          <span className="w-2 h-2 rounded-full bg-on-secondary animate-pulse"></span>
          In Progress
        </div>
      </div>
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md flex-1 min-h-0">
        {/* Map Module (Spans 8 columns on large screens) */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded p-sm flex flex-col relative min-h-[400px]">
          <div className="font-label-sm text-on-surface-variant mb-xs uppercase shrink-0">Route Overview</div>
          <div className="flex-1 bg-surface-container-high border border-outline-variant rounded overflow-hidden relative z-0">
            <MapContainer center={pickupLoc} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              />
              <Marker position={pickupLoc} />
              <Marker position={dropLoc} />
              {routeData && <Polyline positions={routeData} color="#006e2f" weight={5} opacity={0.8} />}
            </MapContainer>
          </div>
        </div>
        {/* Details Sidebar (Spans 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-md h-full">
          {/* Customer Details Module */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-4 shrink-0">
            <div className="font-label-sm text-on-surface-variant mb-3 uppercase">Manifest</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-surface-container-high flex items-center justify-center border border-outline-variant">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Customer</div>
                <div className="font-headline-md text-on-surface">Kumar</div>
              </div>
            </div>
          </div>
          {/* Status Timeline Module */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-4 flex-1">
            <div className="font-label-sm text-on-surface-variant mb-4 uppercase">Status Log</div>
            <div className="relative border-l-2 border-outline-variant ml-3 space-y-6 pb-2">
              {/* Pickup Step */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary text-[12px]">check</span>
                </div>
                <div className="font-bold text-on-surface">Pickup</div>
                <div className="text-secondary font-label-md mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Customer Picked Up
                </div>
              </div>
              {/* Drop Step */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-surface-container-lowest border-2 border-outline-variant"></div>
                <div className="font-bold text-on-surface-variant">Drop</div>
                <div className="text-on-surface-variant font-label-md mt-1 flex items-center gap-1 opacity-70">
                  <span className="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
                  Not Completed
                </div>
              </div>
            </div>
          </div>
          {/* Action Module */}
          <div className="mt-auto shrink-0">
            {!tripStarted ? (
              <button 
                onClick={() => setTripStarted(true)}
                className="w-full bg-[#36B37E] hover:bg-[#2e9c6d] text-on-secondary font-label-md text-label-md py-4 px-6 rounded transition-colors uppercase tracking-wider font-bold border border-[#2e9c6d] shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                [ START TRIP ]
              </button>
            ) : (
              <button 
                onClick={() => navigate('/trip-completed')}
                className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md py-4 px-6 rounded transition-colors uppercase tracking-wider font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">check_circle</span>
                [ COMPLETE TRIP ]
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveTrip;
