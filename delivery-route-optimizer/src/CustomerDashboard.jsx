import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue in React
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

// Custom Map Component to adjust bounds based on route
const MapEffect = ({ routeData, pickupCoords, dropCoords }) => {
  const map = useMap();
  
  useEffect(() => {
    if (pickupCoords && dropCoords && routeData) {
      const bounds = L.latLngBounds([pickupCoords, dropCoords]);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (pickupCoords) {
      map.flyTo(pickupCoords, 14, { animate: true });
    } else if (dropCoords) {
      map.flyTo(dropCoords, 14, { animate: true });
    }
  }, [map, routeData, pickupCoords, dropCoords]);

  return null;
};

// Autocomplete Input Component
const LocationAutocomplete = ({ label, placeholder, iconName, iconColorClass, value, onChange, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimeout = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      // Append 'Tirupati' to restrict results to the Tirupati district, unless already specified
      const searchQuery = query.toLowerCase().includes('tirupati') ? query : `${query}, Tirupati`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1&email=contact@deliveryoptimizer.com`, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setIsOpen(true);
    
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 500);
  };

  const handleSelect = (item) => {
    onChange(item.display_name);
    onSelect([parseFloat(item.lat), parseFloat(item.lon)]);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-xs relative" ref={wrapperRef}>
      <label className="font-label-md text-on-surface-variant font-medium">{label}</label>
      <div className="relative">
        <span className={`material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-[20px] ${iconColorClass}`}>{iconName}</span>
        <input 
          type="text" 
          value={value}
          onChange={handleInputChange}
          onFocus={() => { if(suggestions.length > 0) setIsOpen(true); }}
          placeholder={placeholder} 
          className="w-full pl-[44px] pr-md py-md bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-outline"
        />
        {isOpen && suggestions.length > 0 && (
          <ul className="absolute z-[2000] top-[100%] left-0 w-full mt-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            {suggestions.map((item, idx) => (
              <li 
                key={idx} 
                onClick={() => handleSelect(item)}
                className="p-md hover:bg-surface-container-low cursor-pointer border-b border-outline-variant/10 last:border-0 text-sm flex items-start gap-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-outline mt-0.5">location_on</span>
                <span className="truncate whitespace-normal text-on-surface">{item.display_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [type, setType] = useState('person');
  
  const [routeData, setRouteData] = useState(null);
  const [distance, setDistance] = useState(0);
  const [fare, setFare] = useState(0);

  // UI States: 'idle', 'estimating', 'ready', 'searching'
  const [bookingState, setBookingState] = useState('idle');

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  useEffect(() => {
    if (pickupCoords && dropCoords) {
      setBookingState('estimating');
      fetchRoute(pickupCoords, dropCoords);
    } else {
      setRouteData(null);
      setBookingState('idle');
    }
  }, [pickupCoords, dropCoords]);

  const fetchRoute = async (start, end) => {
    try {
      // OSRM API expects longitude,latitude
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`);
      const data = await res.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // OSRM returns geometry as [lon, lat], Leaflet Polyline expects [lat, lon]
        const coordinates = route.geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteData(coordinates);
        
        const distKm = (route.distance / 1000).toFixed(1);
        setDistance(distKm);
        
        // Simple fare calculation logic based on distance
        const ratePerKm = type === 'person' ? 15 : 20;
        const baseFare = 50;
        setFare(Math.round(baseFare + (distKm * ratePerKm)));
        
        setBookingState('ready');
      } else {
        setBookingState('idle');
      }
    } catch (err) {
      console.error("Failed to fetch route:", err);
      setBookingState('idle');
    }
  };

  // Recalculate fare if type changes
  useEffect(() => {
    if (bookingState === 'ready' && distance > 0) {
      const ratePerKm = type === 'person' ? 15 : 20;
      const baseFare = 50;
      setFare(Math.round(baseFare + (distance * ratePerKm)));
    }
  }, [type, bookingState, distance]);

  const handleBookNow = () => {
    setBookingState('searching');
    
    const tripData = {
      pickup,
      drop,
      pickupCoords,
      dropCoords,
      distance,
      fare,
      routeData
    };

    fetch('http://localhost:5000/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setTimeout(() => {
          navigate('/customer-trip', { state: { ...tripData, tripId: data.trip_id } });
        }, 1500);
      } else {
        alert('Failed to save trip: ' + data.message);
        setBookingState('idle');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error saving trip.');
      setBookingState('idle');
    });
  };

  return (
    <div className="flex min-h-screen h-screen w-screen bg-surface antialiased overflow-hidden">
      
      {/* Left Panel - Booking Form (approx 40%) */}
      <div className="w-[40%] min-w-[380px] max-w-[500px] h-full bg-surface-container-lowest flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.1)] relative">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center px-xl py-lg border-b border-outline-variant/30 bg-surface-container-lowest sticky top-0 z-20">
          <h1 className="font-headline-sm font-bold tracking-tight text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">route</span>
            Plan your journey
          </h1>
          <button 
            onClick={handleLogout} 
            className="w-10 h-10 bg-surface-container hover:bg-surface-container-high rounded-full flex items-center justify-center transition-colors text-on-surface" 
            title="Logout"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="px-xl py-xl flex flex-col gap-lg overflow-y-auto h-full pb-[200px]">
          {/* Booking Form */}
          {bookingState !== 'searching' ? (
            <div className="flex flex-col gap-md animate-fade-in">
              
              <LocationAutocomplete 
                label="Pickup Location"
                placeholder="Where from?"
                iconName="my_location"
                iconColorClass="text-primary"
                value={pickup}
                onChange={setPickup}
                onSelect={setPickupCoords}
              />

              <LocationAutocomplete 
                label="Drop Location"
                placeholder="Where to?"
                iconName="location_on"
                iconColorClass="text-error"
                value={drop}
                onChange={setDrop}
                onSelect={setDropCoords}
              />

              <div className="flex flex-col gap-xs mt-sm">
                <label className="font-label-md text-on-surface-variant font-medium">Type of delivery</label>
                <div className="flex gap-md">
                  <label className={`flex-1 flex items-center justify-center gap-sm p-md rounded-xl border cursor-pointer transition-all ${type === 'person' ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low hover:border-outline-variant'}`}>
                    <input type="radio" name="type" value="person" checked={type === 'person'} onChange={() => setType('person')} className="hidden" />
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-label-md font-semibold">Ride</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-sm p-md rounded-xl border cursor-pointer transition-all ${type === 'parcel' ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low hover:border-outline-variant'}`}>
                    <input type="radio" name="type" value="parcel" checked={type === 'parcel'} onChange={() => setType('parcel')} className="hidden" />
                    <span className="material-symbols-outlined">package</span>
                    <span className="font-label-md font-semibold">Parcel</span>
                  </label>
                </div>
              </div>

              {/* Estimation Area */}
              <div className="mt-xs">
                {bookingState === 'estimating' && (
                  <div className="p-md rounded-xl border border-outline-variant/50 bg-surface-container-low flex items-center justify-center gap-sm text-on-surface-variant animate-pulse">
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                    <span className="text-sm font-medium">Calculating optimal route...</span>
                  </div>
                )}

                {bookingState === 'ready' && (
                  <div className="p-lg rounded-2xl border-2 border-primary/20 bg-primary/5 flex justify-between items-center animate-fade-in shadow-inner">
                    <div>
                      <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Distance</div>
                      <div className="font-headline-sm font-bold text-on-surface">{distance} <span className="text-body-md font-medium text-on-surface-variant">km</span></div>
                    </div>
                    <div className="w-px h-12 bg-outline-variant/50"></div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Estimated Fare</div>
                      <div className="font-headline-sm font-bold text-primary tracking-tight">₹{fare}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button 
                onClick={handleBookNow}
                disabled={bookingState !== 'ready'}
                className="mt-auto w-full bg-primary hover:bg-primary/90 disabled:bg-surface-container disabled:text-outline-variant disabled:cursor-not-allowed text-on-primary font-label-md text-label-md py-lg rounded-xl shadow-md flex items-center justify-center transition-all cursor-pointer uppercase tracking-wider font-bold"
              >
                Confirm Booking
              </button>
            </div>
          ) : (
            /* Searching State */
            <div className="flex flex-col items-center justify-center h-full pb-xl animate-fade-in">
              <div className="relative w-24 h-24 mb-xl">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[32px] animate-pulse">search</span>
                </div>
              </div>
              <h2 className="font-headline-sm font-bold text-on-surface mb-sm">Connecting Rider...</h2>
              <p className="font-body-md text-on-surface-variant flex items-center gap-sm">
                <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
                Finding best match nearby
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Map (Remaining 60%) */}
      <div className="flex-1 h-full relative z-0 bg-surface-container">
         <MapContainer 
           center={[20.5937, 78.9629]} // Default to India roughly
           zoom={5} 
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
      </div>
    </div>
  );
};

export default CustomerDashboard;
