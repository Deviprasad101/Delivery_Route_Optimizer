import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      setIsVerifying(false);

      if (response.ok && data.success) {
        sessionStorage.setItem('userRole', 'admin');
        navigate('/admin-dashboard');
      } else {
        alert(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      console.error('Error connecting to backend:', err);
      setIsVerifying(false);
      alert('Failed to connect to backend server.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-md font-body-md antialiased overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-error-container/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-container/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center mb-xl">
        <div className="w-16 h-16 bg-error text-on-error rounded-2xl flex items-center justify-center mb-md shadow-sm">
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
        </div>
        <h1 className="font-display-sm text-display-sm text-on-surface font-bold tracking-tight text-center">
          Admin Console
        </h1>
        <p className="font-body-lg text-on-surface-variant text-center mt-xs">
          Secure Administrator Access
        </p>
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-surface-container-lowest rounded-[28px] shadow-lg border border-outline-variant p-xl">
        <form onSubmit={handleLogin} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-on-surface-variant">Admin Username</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">person</span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username" 
                className="w-full pl-[44px] pr-md py-md bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-error focus:ring-1 focus:ring-error outline-none transition-all placeholder-outline text-on-surface"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-on-surface-variant">Admin Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">key</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password" 
                className="w-full pl-[44px] pr-md py-md bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-error focus:ring-1 focus:ring-error outline-none transition-all placeholder-outline text-on-surface"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isVerifying}
            className="mt-md w-full bg-error hover:bg-error/90 text-on-error font-label-md text-label-md py-md rounded-full shadow-md flex items-center justify-center transition-transform active:scale-[0.98] cursor-pointer relative z-20 disabled:opacity-70 disabled:cursor-wait"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                Authenticating...
              </span>
            ) : 'Secure Login'}
          </button>
        </form>
      </div>

      <div className="mt-xl text-center relative z-10">
        <Link to="/" className="font-label-md text-error hover:text-error/80 transition-colors flex items-center justify-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Portal Selection
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
