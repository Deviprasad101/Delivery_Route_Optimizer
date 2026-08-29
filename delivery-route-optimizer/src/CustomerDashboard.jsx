import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [type, setType] = useState('person');
  
  // UI States: 'idle', 'estimating', 'ready', 'searching'
  const [bookingState, setBookingState] = useState('idle');

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  // Simulate calculating fare when both inputs have some text
  const handleInputBlur = () => {
    if (pickup.length > 2 && drop.length > 2 && bookingState === 'idle') {
      setBookingState('estimating');
      setTimeout(() => {
        setBookingState('ready');
      }, 800);
    } else if ((pickup.length <= 2 || drop.length <= 2) && bookingState === 'ready') {
      setBookingState('idle');
    }
  };

  const handleBookNow = () => {
    setBookingState('searching');
    // Simulate finding a rider
    setTimeout(() => {
      navigate('/customer-trip');
    }, 3500);
  };

  return (
    <div className="min-h-screen h-screen w-screen bg-surface flex flex-col items-center justify-center p-md font-body-md antialiased overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary-container/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary-container/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest rounded-[24px] shadow-lg border border-outline-variant flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-primary px-xl py-lg text-on-primary flex justify-between items-center">
          <h1 className="font-headline-sm font-bold tracking-tight">Book a Ride / Delivery</h1>
          <button onClick={handleLogout} className="p-xs rounded-full hover:bg-on-primary/10 transition-colors flex items-center justify-center cursor-pointer" title="Logout">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-xl flex flex-col gap-lg">
          
          {/* Booking Form */}
          {bookingState !== 'searching' ? (
            <div className="flex flex-col gap-md animate-fade-in">
              <div className="flex flex-col gap-xs relative">
                <label className="font-label-md text-on-surface-variant font-medium">Pickup Location</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-primary text-[20px]">my_location</span>
                  <input 
                    type="text" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    onBlur={handleInputBlur}
                    placeholder="Enter pickup location" 
                    className="w-full pl-[44px] pr-md py-md bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-outline"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs relative">
                <label className="font-label-md text-on-surface-variant font-medium">Drop Location</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-error text-[20px]">location_on</span>
                  <input 
                    type="text" 
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    onBlur={handleInputBlur}
                    placeholder="Enter drop location" 
                    className="w-full pl-[44px] pr-md py-md bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-outline"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs mt-sm">
                <label className="font-label-md text-on-surface-variant font-medium">Type</label>
                <div className="flex gap-md">
                  <label className={`flex-1 flex items-center justify-center gap-sm p-md rounded-xl border cursor-pointer transition-all ${type === 'person' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}>
                    <input type="radio" name="type" value="person" checked={type === 'person'} onChange={() => setType('person')} className="hidden" />
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-label-md font-semibold">Person</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-sm p-md rounded-xl border cursor-pointer transition-all ${type === 'parcel' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}>
                    <input type="radio" name="type" value="parcel" checked={type === 'parcel'} onChange={() => setType('parcel')} className="hidden" />
                    <span className="material-symbols-outlined">package</span>
                    <span className="font-label-md font-semibold">Parcel</span>
                  </label>
                </div>
              </div>

              {/* Estimation Area */}
              <div className="mt-md">
                {bookingState === 'idle' && (
                  <div className="p-md rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest text-center text-on-surface-variant text-sm">
                    Enter locations to see estimate
                  </div>
                )}
                
                {bookingState === 'estimating' && (
                  <div className="p-md rounded-xl border border-outline-variant bg-surface-container-lowest flex items-center justify-center gap-sm text-on-surface-variant animate-pulse">
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                    <span className="text-sm font-medium">Calculating route...</span>
                  </div>
                )}

                {bookingState === 'ready' && (
                  <div className="p-md rounded-xl border border-primary/30 bg-primary/5 flex justify-between items-center animate-fade-in shadow-sm">
                    <div>
                      <div className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Estimated Distance</div>
                      <div className="font-headline-sm font-bold text-on-surface">8.2 km</div>
                    </div>
                    <div className="w-px h-10 bg-outline-variant/50"></div>
                    <div className="text-right">
                      <div className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Estimated Fare</div>
                      <div className="font-headline-sm font-bold text-primary tracking-tight">₹200</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button 
                onClick={handleBookNow}
                disabled={bookingState !== 'ready'}
                className="mt-sm w-full bg-primary hover:bg-primary/90 disabled:bg-surface-container-high disabled:text-outline disabled:cursor-not-allowed text-on-primary font-label-md text-label-md py-lg rounded-xl shadow-md flex items-center justify-center transition-all cursor-pointer uppercase tracking-wider font-bold"
              >
                BOOK NOW
              </button>
            </div>
          ) : (
            /* Searching State */
            <div className="flex flex-col items-center justify-center py-2xl animate-fade-in">
              <div className="relative w-24 h-24 mb-xl">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[32px] animate-pulse">search</span>
                </div>
              </div>
              <h2 className="font-headline-sm font-bold text-on-surface mb-sm">Searching for Rider...</h2>
              <p className="font-body-md text-on-surface-variant flex items-center gap-sm">
                <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
                Finding nearby rider
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
