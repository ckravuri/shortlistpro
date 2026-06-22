import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthCallback = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // CRITICAL: Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          console.error('No session_id found');
          navigate('/login');
          return;
        }

        // Exchange session_id for user data
        const { data } = await axios.post(
          `${API}/auth/google-session`,
          { session_id: sessionId },
          { withCredentials: true }
        );

        // Clear URL fragment
        window.history.replaceState({}, document.title, window.location.pathname);

        // Navigate to dashboard with user data
        navigate('/dashboard', { state: { user: data }, replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        alert('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    processSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#001F3F' }}></div>
        <p className="body-text-sm" style={{ color: '#708090' }}>
          Completing sign in...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
