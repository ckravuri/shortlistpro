import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Google AdSense Ad Component
 * Shows ads ONLY for free tier users
 * 
 * SETUP INSTRUCTIONS:
 * 1. Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your actual AdSense Publisher ID
 * 2. Replace 'YYYYYYYYYY' with your Ad Slot ID
 * 3. Get these from: https://adsense.google.com
 */

export const AdSenseAd = ({ 
  slot = 'YYYYYYYYYY', 
  format = 'auto',
  style = {},
  className = ''
}) => {
  const { user } = useAuth();

  useEffect(() => {
    // Only load ads for free users
    if (user?.subscription_tier === 'free') {
      try {
        // Push ad to AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [user]);

  // Don't show ads for paid users
  if (!user || user.subscription_tier !== 'free') {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Pre-configured ad sizes
export const AdSenseBanner = (props) => (
  <AdSenseAd 
    {...props} 
    format="horizontal"
    style={{ minHeight: '90px', ...props.style }}
  />
);

export const AdSenseSquare = (props) => (
  <AdSenseAd 
    {...props} 
    format="rectangle"
    style={{ minHeight: '250px', ...props.style }}
  />
);

export const AdSenseSidebar = (props) => (
  <AdSenseAd 
    {...props} 
    format="vertical"
    style={{ minHeight: '600px', ...props.style }}
  />
);

export default AdSenseAd;
