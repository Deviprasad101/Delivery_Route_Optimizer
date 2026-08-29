import React from 'react';
import { Link } from 'react-router-dom';

const Portal = () => {
  return (
    <div className="min-h-screen h-screen w-screen bg-surface flex flex-col items-center justify-center p-md font-body-md antialiased overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary-container/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-secondary-container/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-[24px] shadow-lg border border-outline-variant p-xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center mb-lg shadow-sm">
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
        </div>
        <h1 className="font-display-lg text-display-lg text-on-surface font-bold mb-xs tracking-tight">Logistics Pro</h1>
        <p className="font-body-md text-on-surface-variant mb-xl">Select your portal to continue securely.</p>
        
        <div className="flex flex-col w-full gap-md">
          <Link to="/customer-login" className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm py-md rounded-xl transition-colors border border-outline-variant flex items-center justify-between px-lg group cursor-pointer">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">person</span>
              <span>Customer Portal</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>
          </Link>
          
          <Link to="/rider-login" className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm py-md rounded-xl transition-colors border border-outline-variant flex items-center justify-between px-lg group cursor-pointer">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>two_wheeler</span>
              <span>Rider Portal</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">arrow_forward</span>
          </Link>

          <Link to="/admin-login" className="w-full bg-primary hover:bg-primary/90 text-on-primary font-headline-sm text-headline-sm py-md rounded-xl transition-colors shadow-md flex items-center justify-between px-lg mt-sm cursor-pointer active:scale-[0.98]">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              <span>Admin Console</span>
            </div>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Portal;
