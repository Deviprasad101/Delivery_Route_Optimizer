import React from 'react';
import { Link } from 'react-router-dom';

const TripCompleted = () => {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased overflow-hidden flex h-screen w-screen relative">
      {/* Back Button */}
      <div className="absolute top-md left-md z-50">
        <Link 
          to="/dashboard"
          className="flex items-center gap-xs px-md py-sm bg-surface-container-lowest text-secondary hover:text-primary hover:bg-surface-container rounded-full shadow-sm border border-outline-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="font-label-caps text-label-caps">Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Content Canvas (Centered) */}
      <main className="flex-1 overflow-hidden w-full h-full flex items-center justify-center bg-surface-container-low p-md">
        {/* Confirmation Container */}
        <div className="max-w-xl w-full bg-surface-container-lowest rounded-xl border border-outline-variant p-xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] flex flex-col gap-lg animate-[fade-in_0.3s_ease-out]">
          
          {/* Header Section */}
          <div className="flex flex-col items-center text-center gap-md border-b border-outline-variant pb-lg">
            <div className="w-16 h-16 rounded-full bg-[#D1FAE5] text-[#065F46] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-4xl" data-icon="check_circle" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Trip Completed</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Your delivery to T Nagar was successful.</p>
            </div>
          </div>
          
          {/* Trip Details Section (Bento style card) */}
          <div className="bg-surface rounded-lg p-lg border border-outline-variant flex flex-col gap-md">
            <div className="flex justify-between items-center mb-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant">TRIP DETAILS</span>
              <span className="font-mono-metric text-mono-metric text-primary flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm" data-icon="route">route</span> 7.2 km
              </span>
            </div>
            
            <div className="flex flex-col gap-sm relative">
              {/* Route Line Connector */}
              <div className="absolute left-[11px] top-[24px] bottom-[24px] w-[2px] bg-outline-variant z-0"></div>
              
              {/* Pickup */}
              <div className="flex items-start gap-md z-10">
                <div className="w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">PICKUP</p>
                  <p className="font-body-md text-body-md text-on-surface font-medium">Chennai Central</p>
                </div>
              </div>
              
              {/* Drop */}
              <div className="flex items-start gap-md z-10 mt-md">
                <div className="w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-secondary flex items-center justify-center mt-0.5">
                  <span className="material-symbols-outlined text-[14px] text-secondary" data-icon="location_on">location_on</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">DROP</p>
                  <p className="font-body-md text-body-md text-on-surface font-medium">T Nagar</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fare Breakdown Section */}
          <div className="bg-surface rounded-lg p-lg border border-outline-variant flex flex-col gap-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-xs">FARE BREAKDOWN</span>
            
            <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
              <span>Base Fare</span>
              <span className="font-mono-metric text-mono-metric text-on-surface">₹50.00</span>
            </div>
            
            <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
              <span>Distance (7.2 km)</span>
              <span className="font-mono-metric text-mono-metric text-on-surface">₹120.00</span>
            </div>
            
            <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant pb-md border-b border-outline-variant">
              <span>Taxes & Fees</span>
              <span className="font-mono-metric text-mono-metric text-on-surface">₹0.00</span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center pt-xs mt-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">Total</span>
              <span className="font-display-lg text-display-lg text-primary">₹170.00</span>
            </div>
          </div>
          
          {/* Action Area */}
          <div className="flex flex-col gap-md pt-md mt-auto">
            <button className="w-full bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm py-md px-lg rounded-full flex items-center justify-center gap-sm transition-colors shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] cursor-pointer active:opacity-80">
              <span className="material-symbols-outlined" data-icon="lock">lock</span>
              PAY NOW
            </button>
            <div className="text-center">
              <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">
                Need help with this trip?
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripCompleted;
