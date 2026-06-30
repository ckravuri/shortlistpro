import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Check, X, Crown, Sparkle, ArrowLeft } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Pricing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const handleSubscribe = async (tier) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(tier);
    try {
      const { data } = await axios.post(
        `${API}/create-checkout-session`,
        { tier },
        { withCredentials: true }
      );
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  const currentTier = user?.subscription_tier || 'free';

  const tiers = [
    {
      name: 'Free',
      price: 0,
      tier: 'free',
      description: 'Get started with basic features',
      features: [
        { text: '1 resume per month', included: true },
        { text: 'Basic resume builder', included: true },
        { text: 'Basic ATS score', included: true },
        { text: '5 AI suggestions/month', included: true },
        { text: '1 PDF export/month', included: true },
        { text: 'Resume upload (PDF/DOCX)', included: false },
        { text: 'MS Word export', included: false },
        { text: 'PDF to Word conversion', included: false },
        { text: 'ATS score history', included: false },
        { text: 'Selection Criteria Response', included: false },
        { text: 'Tailor Resume to Job Ad', included: false },
        { text: 'AI Headshot Generator', included: false },
        { text: 'Ads displayed', included: 'warning' },
      ],
      cta: currentTier === 'free' ? 'Current Plan' : 'Downgrade',
      disabled: currentTier === 'free',
    },
    {
      name: 'PRO',
      price: 7.99,
      tier: 'pro',
      popular: true,
      description: 'Perfect for job seekers',
      features: [
        { text: 'Unlimited resumes', included: true },
        { text: 'Resume upload (PDF/DOCX)', included: true },
        { text: 'ATS score history chart', included: true },
        { text: 'Unlimited AI suggestions', included: true },
        { text: 'Unlimited PDF & Word exports', included: true },
        { text: 'MS Word export', included: true },
        { text: 'PDF to Word conversion', included: true },
        { text: 'Selection Criteria Response', included: true },
        { text: 'Tailor Resume to Job Ad', included: true },
        { text: 'Bullet Point Writer', included: true },
        { text: 'Summary Generator', included: true },
        { text: 'Cover Letter Generator', included: true },
        { text: 'AI Headshot Generator', included: false },
        { text: 'No ads', included: true },
      ],
      cta: currentTier === 'pro' ? 'Current Plan' : currentTier === 'pro+' ? 'Downgrade' : 'Upgrade to PRO',
      disabled: currentTier === 'pro',
    },
    {
      name: 'PRO+',
      price: 14.99,
      tier: 'pro+',
      description: 'For professionals who want it all',
      features: [
        { text: 'Everything in PRO', included: true },
        { text: 'AI Headshot Generator', included: true },
        { text: 'PDF to Word conversion', included: true },
        { text: 'MS Word export', included: true },
        { text: 'Priority AI processing', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Early access to features', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: currentTier === 'pro+' ? 'Current Plan' : 'Upgrade to PRO+',
      disabled: currentTier === 'pro+',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="btn-secondary flex items-center gap-2"
            data-testid="back-button"
          >
            <ArrowLeft size={18} weight="bold" />
            Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-hero mb-4">
            Choose Your <span style={{ color: '#50C878' }}>Plan</span>
          </h1>
          <p className="body-text text-lg max-w-2xl mx-auto">
            Start with our free tier and upgrade anytime. All plans include our no-fabrication AI and secure payment processing.
          </p>
          {user && (
            <div className="mt-4">
              <p className="body-text">
                Current plan:{' '}
                <span className="font-semibold" style={{ color: '#001F3F' }}>
                  {currentTier.toUpperCase()}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.tier}
              className={`card relative ${tier.popular ? 'border-2' : ''}`}
              style={{
                borderColor: tier.popular ? '#50C878' : '#E2E8F0',
                transform: tier.popular ? 'scale(1.05)' : 'scale(1)',
              }}
              data-testid={`pricing-card-${tier.tier}`}
            >
              {tier.popular && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-sm text-sm font-medium"
                  style={{ backgroundColor: '#50C878', color: '#001F3F' }}
                >
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-6">
                {tier.tier === 'pro+' && (
                  <Crown size={32} weight="bold" style={{ color: '#001F3F', margin: '0 auto 0.5rem' }} />
                )}
                {tier.tier === 'pro' && (
                  <Sparkle size={32} weight="bold" style={{ color: '#50C878', margin: '0 auto 0.5rem' }} />
                )}
                <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                  {tier.name}
                </h3>
                <p className="body-text-sm mb-4">{tier.description}</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold" style={{ color: '#001F3F' }}>
                    ${tier.price.toFixed(2)}
                  </span>
                  {tier.price > 0 && <span className="body-text-sm"> USD/month</span>}
                </div>
                {tier.price > 0 && (
                  <>
                    <p className="body-text-sm" style={{ color: '#708090' }}>
                      Billed monthly • Cancel anytime
                    </p>
                    {tier.tier !== 'free' && (
                      <p className="text-xs mt-2" style={{ color: '#708090' }}>
                        Prices shown in USD. Stripe automatically converts to your local currency.
                      </p>
                    )}
                  </>
                )}
                {tier.price === 0 && (
                  <p className="body-text-sm" style={{ color: '#50C878', fontWeight: 500 }}>
                    No credit card required
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.included === true && (
                      <Check size={20} weight="bold" style={{ color: '#50C878', flexShrink: 0, marginTop: '2px' }} />
                    )}
                    {feature.included === false && (
                      <X size={20} weight="bold" style={{ color: '#708090', flexShrink: 0, marginTop: '2px' }} />
                    )}
                    {feature.included === 'warning' && (
                      <X size={20} weight="bold" style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <span
                      className="body-text-sm"
                      style={{
                        color: feature.included === false ? '#708090' : '#001F3F',
                        textDecoration: feature.included === false ? 'line-through' : 'none',
                      }}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !tier.disabled && handleSubscribe(tier.tier)}
                disabled={tier.disabled || loading === tier.tier}
                className={tier.disabled ? 'btn-secondary w-full' : 'btn-primary w-full'}
                data-testid={`subscribe-${tier.tier}`}
                style={{ opacity: tier.disabled ? 0.5 : 1 }}
              >
                {loading === tier.tier ? 'Loading...' : tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Currency Note */}
        <div className="mt-12 text-center">
          <p className="body-text-sm" style={{ color: '#708090' }}>
            💳 Prices shown in USD. Your local currency will be displayed at checkout.
            <br />
            Stripe automatically converts to your currency at current exchange rates.
          </p>
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="heading-section text-center mb-8">Why Upgrade?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div
                className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#F8FAFC', border: '2px solid #50C878' }}
              >
                <Sparkle size={32} weight="bold" style={{ color: '#50C878' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                Unlimited AI Power
              </h3>
              <p className="body-text-sm">
                Get unlimited AI suggestions, job ad generation, and ATS optimization without monthly caps.
              </p>
            </div>

            <div className="card text-center">
              <div
                className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#F8FAFC', border: '2px solid #50C878' }}
              >
                <Check size={32} weight="bold" style={{ color: '#50C878' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                Professional Tools
              </h3>
              <p className="body-text-sm">
                Access STAR builder for government jobs, headshot generator, and advanced ATS tracking.
              </p>
            </div>

            <div className="card text-center">
              <div
                className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#F8FAFC', border: '2px solid #50C878' }}
              >
                <X size={32} weight="bold" style={{ color: '#001F3F' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                Ad-Free Experience
              </h3>
              <p className="body-text-sm">
                Focus on your resume without distractions. Pro users see zero ads, ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
