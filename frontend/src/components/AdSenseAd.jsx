import React, { useEffect } from 'react';

export const AdSenseAd = ({ slot = '1234567890', format = 'auto', style = { display: 'block' } }) => {
  useEffect(() => {
    // Load AdSense script if not already loaded
    if (!window.adsbygoogle_loaded) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-ad-client', process.env.REACT_APP_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX');
      document.head.appendChild(script);
      window.adsbygoogle_loaded = true;
    }

    // Push ad
    try {
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={process.env.REACT_APP_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX'}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSenseAd;
