import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- ICONS (Clean SVGs) ---
const Icons = {
  Eye: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  EyeOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>,
  Alert: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
  Check: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
};

const LoginPage = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  // --- LOGIC ---
  const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (isRegistering && !name) return setError('Please enter your full name.');
    if (!email) return setError('Please enter your email address.');
    if (!validateEmail(email)) return setError('Please enter a valid email address.');
    if (!password) return setError('Please enter your password.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    // Simulate API Call
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => navigate('/app'), 2000);
    }, 1500); 
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-container">
      {/* Background decoration can be kept subtle or removed. 
          The CSS class 'ambient-blob' handles this (ensure it exists in CSS if desired) 
      */}
      <div className="ambient-blob"></div>

      <div className="login-card">
        {status !== 'success' ? (
          <>
            <h1 className="login-title">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="login-subtitle">
              {isRegistering 
                ? 'Join thousands of writers improving their tone.' 
                : 'Sign in to access your writing dashboard.'}
            </p>

            <form onSubmit={handleSubmit}>
              
              {/* Name Field (Register Only) */}
              {isRegistering && (
                <div className="input-group">
                  <label className="retro-label">Full Name</label>
                  <input 
                    type="text" 
                    className="retro-input"
                    placeholder="e.g. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="input-group">
                <label className="retro-label">Email Address</label>
                <input 
                  type="text" 
                  className={`retro-input ${error && !email ? 'input-error' : ''}`}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
              </div>

              {/* Password Field */}
              <div className="input-group">
                <label className="retro-label">Password</label>
                <div className="password-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"}
                    className={`retro-input ${error && !password ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={status === 'loading'}
                  />
                  <button 
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
                
                {/* Error Message Display */}
                {error && (
                  <div className="error-msg">
                    <Icons.Alert /> {error}
                  </div>
                )}
              </div>
              
              {/* Forgot Password Link */}
              {!isRegistering && (
                <div style={{textAlign: 'right', marginBottom: '1.5rem', marginTop: '-0.5rem'}}>
                  <a href="#" className="text-link" style={{fontSize: '0.85rem'}}>Forgot password?</a>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn-primary-action" 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Processing...' : (
                  isRegistering ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div style={{marginTop: '1.5rem', fontSize: '0.9rem', color: '#666'}}>
              {isRegistering ? (
                <span>Already have an account? <button onClick={toggleMode} className="text-link">Log in</button></span>
              ) : (
                <span>Don't have an account? <button onClick={toggleMode} className="text-link">Sign up</button></span>
              )}
            </div>

            <div className="divider"><span>OR</span></div>

            <button className="social-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{width: 20, height: 20}}/>
              Continue with Google
            </button>
            
            <Link to="/" className="back-link"><Icons.ArrowLeft /> Back to Home</Link>
          </>
        ) : (
          // SUCCESS STATE
          <div className="success-state">
            <div className="success-icon-circle">
              <Icons.Check />
            </div>
            <h2 style={{fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#166534'}}>
              {isRegistering ? 'Account Created' : 'Login Successful'}
            </h2>
            <p style={{color: '#666', marginBottom: '2rem'}}>
              Redirecting you to the dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;