import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkle, Target, Globe, ArrowRight } from '@phosphor-icons/react';

export const Landing = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={32} weight="bold" style={{ color: '#001F3F' }} />
            <span className="text-2xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              ShortlistPro.cv
            </span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/pricing"
              data-testid="nav-pricing-link"
              className="btn-secondary"
              style={{ padding: '0.5rem 1.5rem' }}
            >
              Pricing
            </Link>
            <Link
              to="/login"
              data-testid="nav-login-link"
              className="btn-secondary"
              style={{ padding: '0.5rem 1.5rem' }}
            >
              Login
            </Link>
            <Link
              to="/register"
              data-testid="nav-register-link"
              className="btn-primary"
              style={{ padding: '0.5rem 1.5rem' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="heading-hero mb-6">
            Build ATS-Ready Resumes
            <br />
            <span style={{ color: '#50C878' }}>That Get You Hired</span>
          </h1>
          <p className="body-text text-lg mb-8 max-w-2xl">
            AI-powered resume builder with real-time ATS scoring, country-aware guidance, and
            professional templates. No fabrication, just results.
          </p>
          <Link
            to="/register"
            data-testid="hero-cta-button"
            className="btn-primary inline-flex items-center gap-2"
            style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
          >
            Start Building Free
            <ArrowRight size={24} weight="bold" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="card" data-testid="feature-ai-guardrail">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center mb-4"
              style={{ backgroundColor: '#50C878' }}
            >
              <Sparkle size={28} weight="bold" style={{ color: '#001F3F' }} />
            </div>
            <h3 className="text-xl font-medium mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              No-Fabrication AI
            </h3>
            <p className="body-text-sm">
              AI suggestions that never invent data. If metrics are missing, we flag them for you to add.
            </p>
          </div>

          <div className="card" data-testid="feature-ats-score">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center mb-4"
              style={{ backgroundColor: '#50C878' }}
            >
              <Target size={28} weight="bold" style={{ color: '#001F3F' }} />
            </div>
            <h3 className="text-xl font-medium mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Real-Time ATS Score
            </h3>
            <p className="body-text-sm">
              See your ATS compatibility score update as you type. Know exactly where you stand.
            </p>
          </div>

          <div className="card" data-testid="feature-country-aware">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center mb-4"
              style={{ backgroundColor: '#50C878' }}
            >
              <Globe size={28} weight="bold" style={{ color: '#001F3F' }} />
            </div>
            <h3 className="text-xl font-medium mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Country-Aware
            </h3>
            <p className="body-text-sm">
              Resume guidance tailored to US, UK, AU, EU, and IN job markets. Regional best practices built-in.
            </p>
          </div>

          <div className="card" data-testid="feature-ats-safe">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center mb-4"
              style={{ backgroundColor: '#50C878' }}
            >
              <FileText size={28} weight="bold" style={{ color: '#001F3F' }} />
            </div>
            <h3 className="text-xl font-medium mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              ATS-Safe Templates
            </h3>
            <p className="body-text-sm">
              Single-column, parse-safe templates only. Your resume will pass any applicant tracking system.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="mt-20 p-12 border rounded-sm"
          style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
        >
          <div className="max-w-2xl">
            <h2 className="heading-section mb-4">Ready to land your dream job?</h2>
            <p className="body-text mb-6">
              Join thousands of professionals who've upgraded their career prospects with ShortlistPro.cv.
            </p>
            <Link
              to="/register"
              data-testid="cta-section-button"
              className="btn-primary"
              style={{ fontSize: '1rem', padding: '0.875rem 1.75rem' }}
            >
              Create Your Resume Now
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="border-t mt-20"
        style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="body-text-sm">
              © 2026 ShortlistPro.cv - Professional Resume Builder
            </p>
            <div className="flex gap-6">
              <Link 
                to="/privacy" 
                className="body-text-sm hover:opacity-70 transition-opacity"
                style={{ color: '#001F3F' }}
              >
                Privacy Policy
              </Link>
              <a 
                href="mailto:support@shortlistpro.cv" 
                className="body-text-sm hover:opacity-70 transition-opacity"
                style={{ color: '#001F3F' }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
