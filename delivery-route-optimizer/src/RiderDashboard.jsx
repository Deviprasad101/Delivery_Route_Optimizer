import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ActiveTrip from './ActiveTrip';

// Fix for default marker icons in react-leaflet when using Vite/Webpack
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
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [map, routeData, pickupCoords, dropCoords]);
  return null;
};

const RiderDashboard = () => {
  const location = useLocation();
  const riderName = location.state?.approvedRider?.name || "Ravi";
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isActiveTrip, setIsActiveTrip] = useState(false);

  useEffect(() => {
    const fetchTrips = () => {
      fetch('http://localhost:5000/api/trips/pending')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.trips.length > 0) {
            setCurrentTrip(data.trips[0]);
          } else {
            setCurrentTrip(null);
          }
        })
        .catch(err => console.error("Error fetching trips:", err));
    };
    
    fetchTrips();
    const interval = setInterval(fetchTrips, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background text-on-background antialiased h-screen flex flex-col overflow-hidden">
      <header className="flex-shrink-0 w-full bg-surface-container-lowest border-b border-outline-variant flex items-center px-margin-mobile md:px-xl h-16 z-50">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-primary">RiderDash</div>
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-secondary hover:bg-surface-container transition-colors duration-200 p-sm rounded-full cursor-pointer">notifications</span>
            <span className="material-symbols-outlined text-secondary hover:bg-surface-container transition-colors duration-200 p-sm rounded-full cursor-pointer">account_circle</span>
          </div>
        </div>
      </header>
      <main className={`flex-grow py-lg pb-[80px] md:pb-lg px-margin-mobile md:px-xl max-w-container-max mx-auto w-full overflow-y-auto md:overflow-hidden min-h-0 ${!isActiveTrip ? 'grid grid-cols-4 md:grid-cols-12 gap-gutter' : ''}`}>
        {isActiveTrip ? (
          <ActiveTrip onBack={() => setIsActiveTrip(false)} />
        ) : (
          <>
            <div className="col-span-4 md:col-span-12 mb-lg">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Welcome, {riderName}</h1>
            </div>
            <div className="col-span-4 md:col-span-4 flex flex-col gap-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <div className="w-4 h-4 rounded-full bg-primary-container"></div>
              <span className="font-label-md text-label-md text-on-surface">ONLINE</span>
            </div>
            <button className="px-md py-sm rounded border border-outline-variant text-secondary font-label-md text-label-md hover:bg-surface-container transition-colors">Go Offline</button>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm flex flex-col gap-md">
            <div className="flex justify-between items-center border-b border-outline-variant pb-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">My Trips</h2>
              <span className="material-symbols-outlined text-secondary">history</span>
            </div>
            
            <div className="flex flex-col gap-sm">
              <p className="font-label-md text-label-md text-secondary font-semibold uppercase">Today</p>
              
              <div className="border border-outline-variant rounded-md p-sm flex justify-between items-center">
                <div>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">Kumar</p>
                  <p className="font-body-sm text-body-sm text-secondary">Chennai → T Nagar</p>
                  <p className="font-label-sm text-label-sm text-primary font-bold mt-1">Completed</p>
                </div>
                <p className="font-headline-sm text-headline-sm font-bold text-on-surface">₹180</p>
              </div>

              <div className="border border-outline-variant rounded-md p-sm flex justify-between items-center">
                <div>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">Suresh</p>
                  <p className="font-body-sm text-body-sm text-secondary">Guindy → Velachery</p>
                  <p className="font-label-sm text-label-sm text-primary font-bold mt-1">Completed</p>
                </div>
                <p className="font-headline-sm text-headline-sm font-bold text-on-surface">₹220</p>
              </div>
            </div>

            <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center">
              <p className="font-label-lg text-label-lg text-secondary uppercase">Today's Earnings</p>
              <p className="font-headline-md text-headline-md font-bold text-primary">₹400</p>
            </div>
          </div>
        </div>
        <div className="col-span-4 md:col-span-8">
          <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl overflow-hidden flex flex-col h-full shadow-md transition-transform duration-200 hover:-translate-y-1">
            <div className="bg-surface p-lg border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface">Current Request</h2>
              <span className="material-symbols-outlined text-tertiary">directions_car</span>
            </div>
            <div className="p-lg flex flex-col gap-md lg:gap-lg flex-grow overflow-y-auto md:overflow-hidden min-h-0">
              {currentTrip ? (
                <>
                  <div className="overflow-hidden rounded-lg border border-outline-variant h-[180px] md:h-[220px] lg:h-[260px] flex-shrink-0 relative z-0">
                    <MapContainer center={currentTrip.pickupCoords} zoom={12} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                      />
                      <Marker position={currentTrip.pickupCoords} />
                      <Marker position={currentTrip.dropCoords} />
                      {currentTrip.routeData && <Polyline positions={currentTrip.routeData} color="#006e2f" weight={5} opacity={0.8} />}
                      <MapEffect routeData={currentTrip.routeData} pickupCoords={currentTrip.pickupCoords} dropCoords={currentTrip.dropCoords} />
                    </MapContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Customer</p>
                      <p className="font-body-lg text-body-lg text-on-surface font-semibold">{currentTrip.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Estimated Fare</p>
                      <p className="font-headline-md text-headline-md text-primary font-bold">₹{currentTrip.fare}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-md relative pl-lg border-l-2 border-outline-variant ml-sm">
                    <div className="relative">
                      <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-secondary border-2 border-surface-container-lowest"></div>
                      <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Pickup</p>
                      <p className="font-body-md text-body-md text-on-surface">{currentTrip.pickup}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-sm bg-primary border-2 border-surface-container-lowest"></div>
                      <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Drop</p>
                      <p className="font-body-md text-body-md text-on-surface">{currentTrip.drop}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-lg border-t border-outline-variant flex justify-between items-center">
                    <div>
                      <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Distance</p>
                      <p className="font-body-lg text-body-lg text-on-surface">{currentTrip.distance} km</p>
                    </div>
                    <button 
                      className="bg-primary-container text-on-primary font-label-md text-label-md font-bold px-xl py-md rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-sm"
                      onClick={() => setIsActiveTrip(true)}
                    >
                      ACCEPT RIDE
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center gap-md opacity-70">
                  <span className="material-symbols-outlined text-[64px] text-outline-variant animate-pulse">radar</span>
                  <p className="font-headline-sm text-on-surface-variant">Waiting for requests...</p>
                  <p className="text-sm text-on-surface-variant">Stay online to receive new trip requests in your area.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </main>
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2 bg-surface-container-lowest border-t border-outline-variant z-50 md:hidden">
        <a className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-95 transition-transform duration-100" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-md text-label-md mt-1">Dashboard</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary hover:text-primary active:scale-95 transition-transform duration-100" href="#">
          <span className="material-symbols-outlined">history</span>
          <span className="font-label-md text-label-md mt-1">History</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary hover:text-primary active:scale-95 transition-transform duration-100" href="#">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-label-md mt-1">Earnings</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary hover:text-primary active:scale-95 transition-transform duration-100" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md mt-1">Settings</span>
        </a>
      </nav>
    </div>
  );
};

export default RiderDashboard;
