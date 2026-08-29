import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem('userRole');

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <aside className="w-64 h-full bg-surface-container-lowest border-r border-outline-variant flex-col hidden md:flex flex-shrink-0 z-50 shadow-sm">
      <div className="h-16 flex items-center px-lg border-b border-outline-variant">
        <span className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-sm">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>two_wheeler</span>
          Delivery
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-lg px-md flex flex-col gap-sm">
        
        {/* Rider Links */}
        {userRole === 'rider' && (
          <>
            <NavLink
              to="/registration"
              className={({ isActive }) => `flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${isActive ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-secondary hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined">person_add</span>
              Registration
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${isActive ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-secondary hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </NavLink>
            <NavLink
              to="/trip-completed"
              className={({ isActive }) => `flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${isActive ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-secondary hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined">check_circle</span>
              Trip Status
            </NavLink>
          </>
        )}

        {/* Admin Links */}
        {userRole === 'admin' && (
          <>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) => `flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${isActive ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-secondary hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Admin Dashboard
            </NavLink>
            <NavLink
              to="/approval"
              className={({ isActive }) => `flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${isActive ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-secondary hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined">fact_check</span>
              Approvals
            </NavLink>
          </>
        )}

        {/* Customer Links */}
        {userRole === 'customer' && (
          <NavLink
            to="/customer-dashboard"
            className={({ isActive }) => `flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${isActive ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-secondary hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined">person</span>
            Customer Dashboard
          </NavLink>
        )}

      </nav>
      <div className="p-md border-t border-outline-variant">
        <div 
          onClick={handleLogout}
          className="flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
