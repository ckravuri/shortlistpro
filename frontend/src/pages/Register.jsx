import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, ArrowLeft, GoogleLogo } from '@phosphor-icons/react';

const REGIONS = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'EU', label: 'European Union' },
  { value: 'IN', label: 'India' },
];

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    region: 'US', // Default to US, user can change in settings later
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData.email, formData.password, formData.name, formData.region);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <FileText size={40} weight="bold" style={{ color: '#001F3F' }} />
          <span className="text-3xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
            ShortlistPro.cv
          </span>
        </div>

        {/* Card */}
        <div className="card">
          <h1 className="heading-section mb-2">Create Your Account</h1>
          <p className="body-text-sm mb-6">Start building your professional resume today</p>

          {error && (
            <div
              data-testid="register-error-message"
              className="mb-4 p-3 border-l-4 rounded-sm"
              style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#991B1B' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="input-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                data-testid="register-name-input"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                data-testid="register-email-input"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                data-testid="register-password-input"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={8}
              />
              <p className="text-xs mt-1" style={{ color: '#708090' }}>
                Minimum 8 characters
              </p>
            </div>

            <button
              type="submit"
              data-testid="register-submit-button"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#E2E8F0' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2" style={{ backgroundColor: '#FFFFFF', color: '#708090' }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg font-medium transition-all"
            style={{
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#001F3F'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.borderColor = '#001F3F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <GoogleLogo size={20} weight="bold" />
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="body-text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                data-testid="register-login-link"
                className="font-medium"
                style={{ color: '#50C878' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            data-testid="register-back-home-link"
            className="inline-flex items-center gap-2 body-text-sm"
            style={{ color: '#708090' }}
          >
            <ArrowLeft size={16} weight="bold" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
