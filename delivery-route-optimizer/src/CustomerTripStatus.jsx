import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapEffect = ({ routeData, pickupCoords, dropCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (pickupCoords && dropCoords) {
      const bounds = L.latLngBounds([pickupCoords, dropCoords]);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [map, routeData, pickupCoords, dropCoords]);
  return null;
};

const CustomerTripStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract passed state
  const { 
    pickup = 'Chennai Central', 
    drop = 'T Nagar', 
    pickupCoords = [13.0622, 80.2524], 
    dropCoords = [13.0418, 80.2341], 
    routeData = null,
    distance = '7.2',
    fare = 170
  } = location.state || {};

  const [availableRiders, setAvailableRiders] = useState([]);
  const [assignedRider, setAssignedRider] = useState(null);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    // Fetch available riders from the backend
    fetch('http://localhost:5000/api/riders/available')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAvailableRiders(data.riders);
        }
      })
      .catch(err => console.error("Failed to fetch riders:", err));
  }, []);

  const statuses = [
    { label: "Rider Assigned", desc: assignedRider ? `${assignedRider.username} is on the way` : 'Rider is on the way' },
    { label: "Rider Arrived", desc: assignedRider ? `${assignedRider.username} is at the pickup location` : 'At pickup location' },
    { label: "Picked Up", desc: "Package secured" },
    { label: "Going to Destination", desc: "En route to drop location" },
    { label: "Trip Completed", desc: "Delivered successfully" }
  ];

  // Simulate trip progression only AFTER a rider is assigned
  useEffect(() => {
    if (assignedRider && statusIndex < 4) {
      const timer = setTimeout(() => {
        setStatusIndex(prev => prev + 1);
      }, 4000); // advance every 4 seconds
      return () => clearTimeout(timer);
    }
  }, [assignedRider, statusIndex]);

  const handlePayNow = () => {
    alert("Payment Processing...");
    navigate('/customer-dashboard');
  };

  return (
    <div className="flex min-h-screen h-screen w-screen bg-surface antialiased overflow-hidden">
      
      {/* Left Panel */}
      <div className="w-[40%] min-w-[380px] max-w-[500px] h-full bg-surface-container-lowest flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.1)] relative">
        {/* Header */}
        <div className="bg-primary px-xl py-lg text-on-primary flex justify-center items-center shadow-md relative z-20 shrink-0">
          <h1 className="font-headline-sm font-bold tracking-widest uppercase">Your Trip</h1>
        </div>

        <div className="px-xl py-xl flex-1 flex flex-col gap-lg overflow-y-auto">
          
          {!assignedRider ? (
            // RIDER SELECTION VIEW
            <div className="flex flex-col gap-md animate-fade-in">
              <h2 className="font-headline-sm font-bold text-on-surface mb-sm">Select a Rider</h2>
              <p className="text-body-md text-on-surface-variant mb-md">We found the following riders near your location.</p>
              
              {availableRiders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-xl bg-surface-container-low rounded-2xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[32px] text-outline-variant mb-2 animate-spin">sync</span>
                  <span className="text-on-surface-variant font-medium">Looking for riders...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-sm">
                  {availableRiders.map(rider => (
                    <div 
                      key={rider.id}
                      onClick={() => setAssignedRider(rider)}
                      className="p-md rounded-2xl border border-outline-variant/50 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-md">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${rider.username}&background=random`} 
                          alt={rider.username} 
                          className="w-12 h-12 rounded-full border border-outline-variant"
                        />
                        <div>
                          <div className="font-bold text-on-surface text-lg group-hover:text-primary transition-colors">{rider.username}</div>
                          <div className="text-sm text-on-surface-variant capitalize">{rider.status} • 4.8 ★</div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : statusIndex < 4 ? (
            // ACTIVE TRIP VIEW
            <div className="flex flex-col gap-xl h-full animate-fade-in">
              {/* Rider Details */}
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-md">
                <div className="flex items-center gap-md">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${assignedRider.username}&background=random`} 
                    alt={assignedRider.username} 
                    className="w-14 h-14 rounded-full border-2 border-primary object-cover shadow-sm" 
                  />
                  <div>
                    <h2 className="font-headline-sm font-bold text-on-surface">{assignedRider.username}</h2>
                    <p className="font-body-md text-on-surface-variant text-sm">Bike • Verified</p>
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
                  <div className="text-left w-full overflow-hidden">
                    <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-0.5">Pickup</div>
                    <div className="font-medium text-on-surface truncate whitespace-normal line-clamp-2">{pickup}</div>
                  </div>
                </div>
                <div className="flex items-start gap-md mb-md border-b border-outline-variant/30 pb-md">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-error text-[20px]">location_on</span>
                  </div>
                  <div className="text-left w-full overflow-hidden">
                    <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-0.5">Drop</div>
                    <div className="font-medium text-on-surface truncate whitespace-normal line-clamp-2">{drop}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-sm">
                  <span className="text-on-surface-variant font-medium">Distance</span>
                  <span className="font-semibold text-on-surface">{distance} km</span>
                </div>

                <div className="my-md border-t border-dashed border-outline-variant/70"></div>

                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-sm">Fare Breakdown</div>
                
                <div className="flex justify-between items-center mb-xs">
                  <span className="text-on-surface-variant">Base Fare</span>
                  <span className="font-mono text-on-surface">₹50</span>
                </div>
                <div className="flex justify-between items-center mb-md">
                  <span className="text-on-surface-variant">Distance ({distance} km)</span>
                  <span className="font-mono text-on-surface">₹{Math.max(0, fare - 50)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-sm border-t border-outline-variant/30">
                  <span className="font-bold text-on-surface">Total</span>
                  <span className="font-bold text-primary text-xl tracking-tight">₹{fare}</span>
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

      {/* Right Panel - Map (Remaining 60%) */}
      <div className="flex-1 h-full relative z-0 bg-surface-container">
         <MapContainer 
           center={pickupCoords || [20.5937, 78.9629]} 
           zoom={13} 
           style={{ height: '100%', width: '100%' }} 
           zoomControl={true}
         >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {pickupCoords && <Marker position={pickupCoords} />}
            {dropCoords && <Marker position={dropCoords} />}
            {routeData && <Polyline positions={routeData} color="#2563eb" weight={5} opacity={0.8} />}
            <MapEffect routeData={routeData} pickupCoords={pickupCoords} dropCoords={dropCoords} />
         </MapContainer>
         
         {/* Map Overlay Badge */}
         {assignedRider && statusIndex < 4 && (
           <div className="absolute top-sm right-sm z-[400] bg-surface-container-lowest/90 backdrop-blur-sm px-md py-xs rounded-full border border-outline-variant shadow-sm font-label-sm font-bold uppercase tracking-wider text-primary flex items-center gap-xs">
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
             Live Tracking
           </div>
         )}
      </div>

    </div>
  );
};

export default CustomerTripStatus;
