import React, { useState, useEffect } from 'react';
import { X, Cookie } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="max-w-6xl mx-auto rounded-lg shadow-2xl border"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E2E8F0',
        }}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Cookie size={32} weight="bold" style={{ color: '#001F3F' }} />
                <h3
                  className="text-xl md:text-2xl font-semibold"
                  style={{ fontFamily: 'Outfit', color: '#001F3F' }}
                >
                  Cookie Consent
                </h3>
              </div>
              
              <p className="body-text mb-4" style={{ color: '#475569' }}>
                We use cookies to enhance your browsing experience, provide personalized content, 
                and analyze our traffic. Cookies help us understand how you use our platform and 
                improve our services.
              </p>

              <div className="mb-6">
                <details className="mb-3">
                  <summary
                    className="cursor-pointer font-semibold mb-2 hover:opacity-70"
                    style={{ color: '#001F3F' }}
                  >
                    What cookies do we use?
                  </summary>
                  <div className="ml-4 space-y-2 body-text-sm" style={{ color: '#64748B' }}>
                    <p>
                      <strong>Essential Cookies:</strong> Required for authentication, session management, 
                      and core platform functionality. These cannot be disabled.
                    </p>
                    <p>
                      <strong>Analytics Cookies:</strong> Help us understand user behavior and improve 
                      our service (Google Analytics, when enabled).
                    </p>
                    <p>
                      <strong>Advertising Cookies:</strong> Used to display relevant ads for free-tier 
                      users (Google AdSense).
                    </p>
                  </div>
                </details>

                <p className="body-text-sm" style={{ color: '#64748B' }}>
                  By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can manage your 
                  preferences at any time. Learn more in our{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="btn-primary px-6 py-3"
                  style={{ fontFamily: 'Outfit' }}
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="btn-secondary px-6 py-3"
                  style={{ fontFamily: 'Outfit' }}
                >
                  Decline Optional Cookies
                </button>
                <Link
                  to="/privacy"
                  className="btn-secondary px-6 py-3 text-center"
                  style={{ fontFamily: 'Outfit' }}
                >
                  Learn More
                </Link>
              </div>
            </div>

            <button
              onClick={handleDecline}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close cookie consent"
            >
              <X size={24} style={{ color: '#64748B' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
