import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, ArrowLeft } from '@phosphor-icons/react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
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
          <h1 className="heading-section mb-2">Welcome Back</h1>
          <p className="body-text-sm mb-6">Sign in to continue building your resume</p>

          {error && (
            <div
              data-testid="login-error-message"
              className="mb-4 p-3 border-l-4 rounded-sm"
              style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#991B1B' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                data-testid="login-email-input"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                data-testid="login-password-input"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              data-testid="login-submit-button"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="body-text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                data-testid="login-register-link"
                className="font-medium"
                style={{ color: '#50C878' }}
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            data-testid="login-back-home-link"
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

export default Login;
