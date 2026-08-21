import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet when using Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RiderDashboard = () => {
  const location = useLocation();
  const riderName = location.state?.approvedRider?.name || "Ravi";
  const [routeData, setRouteData] = useState(null);

  const pickupLoc = [13.0827, 80.2707];
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
      <main className="flex-grow py-lg pb-[80px] md:pb-lg px-margin-mobile md:px-xl max-w-container-max mx-auto w-full grid grid-cols-4 md:grid-cols-12 gap-gutter overflow-y-auto md:overflow-hidden min-h-0">
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
              <div className="overflow-hidden rounded-lg border border-outline-variant h-[180px] md:h-[220px] lg:h-[260px] flex-shrink-0 relative z-0">
                <MapContainer center={[13.0622, 80.2524]} zoom={12} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  />
                  <Marker position={pickupLoc} />
                  <Marker position={dropLoc} />
                  {routeData && <Polyline positions={routeData} color="#006e2f" weight={5} opacity={0.8} />}
                </MapContainer>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Customer</p>
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold">Kumar</p>
                </div>
                <div className="text-right">
                  <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Estimated Fare</p>
                  <p className="font-headline-md text-headline-md text-primary font-bold">₹180</p>
                </div>
              </div>
              <div className="flex flex-col gap-md relative pl-lg border-l-2 border-outline-variant ml-sm">
                <div className="relative">
                  <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-secondary border-2 border-surface-container-lowest"></div>
                  <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Pickup</p>
                  <p className="font-body-md text-body-md text-on-surface">Chennai Central</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-sm bg-primary border-2 border-surface-container-lowest"></div>
                  <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Drop</p>
                  <p className="font-body-md text-body-md text-on-surface">T Nagar</p>
                </div>
              </div>
              <div className="mt-auto pt-lg border-t border-outline-variant flex justify-between items-center">
                <div>
                  <p className="font-label-sm text-label-sm text-secondary uppercase mb-xs">Distance</p>
                  <p className="font-body-lg text-body-lg text-on-surface">7.2 km</p>
                </div>
                <button className="bg-primary-container text-on-primary font-label-md text-label-md font-bold px-xl py-md rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-sm">
                  ACCEPT RIDE
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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
