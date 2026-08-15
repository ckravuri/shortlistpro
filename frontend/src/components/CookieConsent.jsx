import React, { useEffect, useState } from 'react';
import { X, Cookie } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent) return undefined;

    const timer = window.setTimeout(() => setIsVisible(true), 1000);
    return () => window.clearTimeout(timer);
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
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:max-w-md">
      <div
        className="relative rounded-lg border p-4 shadow-xl"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
      >
        <button
          onClick={handleDecline}
          className="absolute right-2 top-2 rounded-lg p-2 transition-colors hover:bg-gray-100"
          aria-label="Close cookie consent"
        >
          <X size={20} style={{ color: '#64748B' }} />
        </button>

        <div className="pr-8">
          <div className="mb-2 flex items-center gap-2">
            <Cookie size={24} weight="bold" style={{ color: '#001F3F' }} />
            <h3 className="text-lg font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Cookie preferences
            </h3>
          </div>

          <p className="body-text-sm mb-4" style={{ color: '#475569' }}>
            We use essential cookies to run ShortlistPro and optional cookies to improve the service.
            Read our{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{' '}
            for details.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleAccept}
              className="btn-primary flex-1 px-4 py-2"
              style={{ fontFamily: 'Outfit' }}
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="btn-secondary flex-1 px-4 py-2"
              style={{ fontFamily: 'Outfit' }}
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
