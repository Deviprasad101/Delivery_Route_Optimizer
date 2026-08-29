import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RiderLogin = () => {
  const navigate = useNavigate();
  // modes: 'login', 'register'
  const [mode, setMode] = useState('login');
  
  // step 1: credentials, step 2: otp
  const [step, setStep] = useState(1);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sessionEmail, setSessionEmail] = useState('');

  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const endpoint = mode === 'register' ? '/api/register' : '/api/login';
      const bodyData = { role: 'rider', username, password };
      if (mode === 'register') bodyData.email = email;

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      
      const data = await response.json();
      setIsSending(false);

      if (response.ok && data.success) {
        setSessionEmail(mode === 'register' ? email : data.email);
        setStep(2);
      } else {
        alert(data.message || 'Error occurred');
      }
    } catch (err) {
      console.error('Error connecting to backend:', err);
      setIsSending(false);
      alert('Failed to connect to backend server.');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length === 4) {
      setIsVerifying(true);
      try {
        const response = await fetch('http://localhost:5000/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: sessionEmail, otp: enteredOtp })
        });
        
        const data = await response.json();
        setIsVerifying(false);

        if (response.ok && data.success) {
          sessionStorage.setItem('userRole', 'rider');
          if (mode === 'register') {
            // New riders need to upload documents
            navigate('/registration');
          } else {
            // Existing riders go straight to dashboard
            navigate('/dashboard');
          }
        } else {
          alert(data.message || 'Invalid OTP.');
        }
      } catch (err) {
        console.error('Error connecting to backend:', err);
        setIsVerifying(false);
        alert('Failed to verify OTP.');
      }
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-md font-body-md antialiased overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-primary-container/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-secondary-container/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center mb-xl">
        <div className="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center mb-md shadow-sm">
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>two_wheeler</span>
        </div>
        <h1 className="font-display-sm text-display-sm text-on-surface font-bold tracking-tight text-center">
          Rider Portal
        </h1>
        <p className="font-body-lg text-on-surface-variant text-center mt-xs">
          Deliver and earn
        </p>
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-surface-container-lowest rounded-[28px] shadow-lg border border-outline-variant p-xl">
        {step === 1 ? (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="flex justify-between items-center mb-xl border-b border-outline-variant/50">
              <button 
                onClick={() => setMode('login')} 
                className={`flex-1 pb-sm font-label-lg transition-colors border-b-2 ${mode === 'login' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setMode('register')} 
                className={`flex-1 pb-sm font-label-lg transition-colors border-b-2 ${mode === 'register' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmitCredentials} className="flex flex-col flex-1 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-on-surface-variant">Username</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">person</span>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter username" 
                    className="w-full pl-xl pr-md py-md bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-outline text-on-surface"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div className="flex flex-col gap-xs animate-fade-in">
                  <label className="font-label-md text-on-surface-variant">Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter email address" 
                      className="w-full pl-xl pr-md py-md bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-outline text-on-surface"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-on-surface-variant">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password" 
                    className="w-full pl-xl pr-md py-md bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-outline text-on-surface"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isSending}
                className="mt-md w-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md py-md rounded-full shadow-md flex items-center justify-center transition-transform active:scale-[0.98] cursor-pointer relative z-20 disabled:opacity-70 disabled:cursor-wait"
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                    Processing...
                  </span>
                ) : (
                  mode === 'register' ? 'Create Account & Send OTP' : 'Login & Send OTP'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-slide-in-right">
            <button 
              onClick={() => setStep(1)} 
              className="self-start mb-lg text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs font-label-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back
            </button>

            <div className="text-center mb-xl">
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
              </div>
              <h2 className="font-headline-sm font-bold text-on-surface mb-xs">Verify your Email</h2>
              <p className="font-body-md text-on-surface-variant">
                We've sent a secure OTP to <br/><span className="font-semibold text-on-surface">{sessionEmail}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="flex flex-col flex-1">
              <div className="flex justify-between gap-sm mb-xl px-md">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-[60px] h-[72px] bg-surface-container-low border border-outline-variant/50 rounded-2xl text-center text-[28px] font-bold text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                  />
                ))}
              </div>
              
              <button 
                type="submit"
                disabled={isVerifying}
                className="mt-auto w-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md py-md rounded-full shadow-md flex items-center justify-center transition-transform active:scale-[0.98] cursor-pointer relative z-20 disabled:opacity-70 disabled:cursor-wait"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                    Verifying...
                  </span>
                ) : 'Verify & Continue'}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="mt-xl text-center relative z-10">
        <Link to="/" className="font-label-md text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Portal Selection
        </Link>
      </div>
    </div>
  );
};

export default RiderLogin;
