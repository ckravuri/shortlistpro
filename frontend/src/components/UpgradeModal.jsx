import React from 'react';
import { X, Crown, Check, Sparkles } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const UpgradeModal = ({ isOpen, onClose, message, currentCount, limit }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate('/pricing');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div 
        className="relative max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} style={{ color: '#64748B' }} />
        </button>

        {/* Header with Gradient Background */}
        <div 
          className="relative px-8 pt-12 pb-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #001F3F 0%, #50C878 100%)'
          }}
        >
          <div className="flex justify-center mb-4">
            <div 
              className="p-4 rounded-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Crown size={48} weight="fill" style={{ color: '#FFFFFF' }} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Outfit', color: '#FFFFFF' }}>
            Upgrade to Pro
          </h2>
          <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Unlock unlimited resumes and premium features
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Usage Status */}
          <div 
            className="mb-6 p-4 rounded-lg border"
            style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}
          >
            <p className="text-center font-semibold mb-2" style={{ color: '#991B1B' }}>
              You&apos;ve reached your limit!
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#FEE2E2' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    backgroundColor: '#EF4444',
                    width: `${(currentCount / limit) * 100}%`
                  }}
                />
              </div>
              <span className="font-bold" style={{ color: '#991B1B' }}>
                {currentCount}/{limit}
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Upgrade and get:
            </h3>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-1 rounded-full" style={{ backgroundColor: '#D1FAE5' }}>
                <Check size={16} weight="bold" style={{ color: '#059669' }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#001F3F' }}>Up to 10 Resumes (Pro)</p>
                <p className="text-sm" style={{ color: '#64748B' }}>Or unlimited with Pro+</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-1 rounded-full" style={{ backgroundColor: '#D1FAE5' }}>
                <Check size={16} weight="bold" style={{ color: '#059669' }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#001F3F' }}>Unlimited AI Suggestions</p>
                <p className="text-sm" style={{ color: '#64748B' }}>Get endless AI-powered improvements</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-1 rounded-full" style={{ backgroundColor: '#D1FAE5' }}>
                <Check size={16} weight="bold" style={{ color: '#059669' }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#001F3F' }}>All Premium Templates</p>
                <p className="text-sm" style={{ color: '#64748B' }}>Access to exclusive ATS-optimized designs</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-1 rounded-full" style={{ backgroundColor: '#D1FAE5' }}>
                <Check size={16} weight="bold" style={{ color: '#059669' }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#001F3F' }}>Priority Support</p>
                <p className="text-sm" style={{ color: '#64748B' }}>Get help faster when you need it</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2"
              style={{ fontFamily: 'Outfit' }}
            >
              <Sparkles size={24} weight="fill" />
              Upgrade Now - Starting at $7.99/mo
            </button>
            <button
              onClick={onClose}
              className="w-full btn-secondary py-3"
              style={{ fontFamily: 'Outfit' }}
            >
              Maybe Later
            </button>
          </div>

          {/* Small print */}
          <p className="text-center text-xs mt-4" style={{ color: '#94A3B8' }}>
            7-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
