import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CustomerTripStatus = () => {
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [statusIndex, setStatusIndex] = useState(0);

  const pickupLoc = [13.0622, 80.2524];
  const dropLoc = [13.0418, 80.2341];

  const statuses = [
    { label: "Rider Assigned", desc: "Ravi is on the way" },
    { label: "Rider Arrived", desc: "Ravi is at the pickup location" },
    { label: "Picked Up", desc: "Package secured" },
    { label: "Going to Destination", desc: "En route to drop location" },
    { label: "Trip Completed", desc: "Delivered successfully" }
  ];

  useEffect(() => {
    // Fetch route from OSRM
    fetch(`https://router.project-osrm.org/route/v1/driving/${pickupLoc[1]},${pickupLoc[0]};${dropLoc[1]},${dropLoc[0]}?overview=full&geometries=geojson`)
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteData(coords);
        }
      })
      .catch(err => console.error("Error fetching OSRM route:", err));
  }, []);

  // Simulate trip progression
  useEffect(() => {
    if (statusIndex < 4) {
      const timer = setTimeout(() => {
        setStatusIndex(prev => prev + 1);
      }, 4000); // advance every 4 seconds
      return () => clearTimeout(timer);
    }
  }, [statusIndex]);

  const handlePayNow = () => {
    alert("Payment Processing...");
    navigate('/customer-dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body-md antialiased md:p-xl p-0">
      <div className="flex-1 w-full max-w-2xl mx-auto bg-surface-container-lowest md:border border-outline-variant/50 md:rounded-[24px] md:shadow-lg flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-primary px-xl py-md text-on-primary flex justify-center items-center shadow-md relative z-10 shrink-0">
          <h1 className="font-headline-sm font-bold tracking-widest uppercase">Your Trip</h1>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Map Area */}
          <div className="h-[250px] w-full bg-surface-container shrink-0 relative z-0">
            <MapContainer center={pickupLoc} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OSM'
              />
              <Marker position={pickupLoc} />
              <Marker position={dropLoc} />
              {routeData && <Polyline positions={routeData} color="#006e2f" weight={4} opacity={0.8} />}
            </MapContainer>
            
            {/* Map Overlay Badge */}
            {statusIndex < 4 && (
              <div className="absolute top-sm right-sm z-[400] bg-surface-container-lowest/90 backdrop-blur-sm px-md py-xs rounded-full border border-outline-variant shadow-sm font-label-sm font-bold uppercase tracking-wider text-primary flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Live Tracking
              </div>
            )}
          </div>

          <div className="p-xl flex-1 flex flex-col gap-lg bg-surface-container-lowest z-10 relative shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)]">
            
            {statusIndex < 4 ? (
              // ACTIVE TRIP VIEW
              <div className="flex flex-col gap-xl h-full animate-fade-in">
                
                {/* Rider Details */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-md">
                  <div className="flex items-center gap-md">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFoJgA3wA0Rms2u5N7T8E_Qn9D1K3T-9O7qBvG9H0B5zU6jM9T9v2xO_G4D_kY8Z8J2R4N2J8D0K5D3L7C2R4N2J8D0K5D3L7C=s100" 
                      alt="Rider Ravi" 
                      className="w-14 h-14 rounded-full border-2 border-primary object-cover" 
                    />
                    <div>
                      <h2 className="font-headline-sm font-bold text-on-surface">Ravi</h2>
                      <p className="font-body-md text-on-surface-variant text-sm">Bike • TN XX XXXX</p>
                    </div>
                  </div>
                  <div className="flex gap-sm">
                    <button className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-center text-primary shadow-sm border border-outline-variant/30">
                      <span className="material-symbols-outlined text-[20px]">call</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-center text-primary shadow-sm border border-outline-variant/30">
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                    </button>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="flex-1 px-sm">
                  <h3 className="font-label-lg font-bold text-on-surface-variant uppercase tracking-wider mb-lg">Status</h3>
                  <div className="relative border-l-2 border-outline-variant/50 ml-3 space-y-6">
                    {statuses.slice(0, 4).map((status, idx) => {
                      const isCompleted = idx < statusIndex;
                      const isActive = idx === statusIndex;
                      const isPending = idx > statusIndex;

                      return (
                        <div key={idx} className="relative pl-6">
                          {/* Dot */}
                          <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-500' : isActive ? 'bg-primary border-2 border-primary-container ring-4 ring-primary/20' : 'bg-surface-container-lowest border-2 border-outline-variant'
                          }`}>
                            {isCompleted && <span className="material-symbols-outlined text-on-primary text-[10px] font-bold">check</span>}
                          </div>
                          
                          <div className={`font-bold transition-colors duration-300 ${isPending ? 'text-on-surface-variant/50' : 'text-on-surface'}`}>
                            {status.label}
                          </div>
                          <div className={`text-sm mt-0.5 transition-colors duration-300 ${isPending ? 'text-on-surface-variant/30' : 'text-on-surface-variant'}`}>
                            {status.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button className="w-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md py-md rounded-xl transition-colors border border-outline-variant shadow-sm flex items-center justify-center gap-sm uppercase tracking-wider font-bold">
                  <span className="material-symbols-outlined">support_agent</span>
                  Contact Support
                </button>
              </div>
            ) : (
              // TRIP COMPLETED VIEW (Invoice)
              <div className="flex flex-col h-full animate-fade-in">
                <div className="flex flex-col items-center text-center mb-xl">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-sm shadow-inner">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <h2 className="font-headline-md font-bold text-on-surface">Trip Completed</h2>
                  <p className="text-on-surface-variant">Your package was delivered successfully.</p>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-lg shadow-sm mb-auto">
                  <div className="flex items-start gap-md mb-md">
                    <div className="mt-1">
                      <span className="material-symbols-outlined text-primary text-[20px]">my_location</span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-0.5">Pickup</div>
                      <div className="font-medium text-on-surface">Chennai Central</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-md mb-md border-b border-outline-variant/30 pb-md">
                    <div className="mt-1">
                      <span className="material-symbols-outlined text-error text-[20px]">location_on</span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-0.5">Drop</div>
                      <div className="font-medium text-on-surface">T Nagar</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-sm">
                    <span className="text-on-surface-variant font-medium">Distance</span>
                    <span className="font-semibold text-on-surface">7.2 km</span>
                  </div>

                  <div className="my-md border-t border-dashed border-outline-variant/70"></div>

                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-sm">Fare Breakdown</div>
                  
                  <div className="flex justify-between items-center mb-xs">
                    <span className="text-on-surface-variant">Base Fare</span>
                    <span className="font-mono text-on-surface">₹50</span>
                  </div>
                  <div className="flex justify-between items-center mb-md">
                    <span className="text-on-surface-variant">Distance (7.2 km)</span>
                    <span className="font-mono text-on-surface">₹120</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-sm border-t border-outline-variant/30">
                    <span className="font-bold text-on-surface">Total</span>
                    <span className="font-bold text-primary text-xl tracking-tight">₹170</span>
                  </div>
                </div>

                <button 
                  onClick={handlePayNow}
                  className="mt-xl w-full bg-primary hover:bg-primary/90 text-on-primary font-label-md py-lg rounded-xl shadow-md flex items-center justify-center transition-all uppercase tracking-wider font-bold text-[16px]"
                >
                  PAY NOW
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTripStatus;
