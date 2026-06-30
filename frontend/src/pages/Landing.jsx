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
            <div style={{
              background: 'linear-gradient(135deg, #001F3F 0%, #50C878 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block'
            }}>
              <FileText size={32} weight="bold" />
            </div>
            <span 
              className="text-2xl font-semibold" 
              style={{ 
                fontFamily: 'Outfit',
                background: 'linear-gradient(135deg, #001F3F 0%, #50C878 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
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

        {/* Trust Badges Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Trusted by Job Seekers Worldwide
            </h2>
            <p className="body-text" style={{ color: '#64748B' }}>
              Your data security and success are our top priorities
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* SSL Encryption */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 6V11C4 16.55 7.84 21.74 13 23C18.16 21.74 22 16.55 22 11V6L14 2H12Z" fill="#50C878" opacity="0.2"/>
                  <path d="M12 2L4 6V11C4 16.55 7.84 21.74 13 23C18.16 21.74 22 16.55 22 11V6L14 2H12Z" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L11 14L15 10" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                256-bit SSL Encryption
              </h4>
              <p className="body-text-sm" style={{ color: '#64748B' }}>
                Bank-level encryption protects your personal data
              </p>
            </div>

            {/* Secure Payments */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="13" rx="2" fill="#50C878" opacity="0.2"/>
                  <rect x="3" y="6" width="18" height="13" rx="2" stroke="#001F3F" strokeWidth="2"/>
                  <path d="M3 10H21" stroke="#001F3F" strokeWidth="2"/>
                  <path d="M7 15H10" stroke="#001F3F" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                Secure Payment Gateway
              </h4>
              <p className="body-text-sm" style={{ color: '#64748B' }}>
                Powered by Stripe - PCI DSS Level 1 certified
              </p>
            </div>

            {/* GDPR Compliant */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#50C878" opacity="0.2"/>
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                GDPR Compliant
              </h4>
              <p className="body-text-sm" style={{ color: '#64748B' }}>
                Your privacy rights are fully protected
              </p>
            </div>

            {/* 7-Day Guarantee */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" fill="#50C878" opacity="0.2"/>
                  <circle cx="12" cy="12" r="9" stroke="#001F3F" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                7-Day Money Back
              </h4>
              <p className="body-text-sm" style={{ color: '#64748B' }}>
                100% refund guarantee on all subscriptions
              </p>
            </div>
          </div>
        </div>

        {/* User Testimonials Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Success Stories from Our Users
            </h2>
            <p className="body-text" style={{ color: '#64748B' }}>
              Real results from professionals who landed their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#50C878' }}>
                  <span className="text-xl font-bold" style={{ color: '#001F3F' }}>SM</span>
                </div>
                <div>
                  <h4 className="font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>Sarah Mitchell</h4>
                  <p className="body-text-sm" style={{ color: '#64748B' }}>Software Engineer</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#50C878">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                ))}
              </div>
              <p className="body-text-sm" style={{ color: '#475569' }}>
                &quot;The ATS scoring feature helped me identify exactly what was wrong with my resume. 
                After using ShortlistPro, I got 3 interviews in the first week and landed my dream job at a top tech company!&quot;
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#50C878' }}>
                  <span className="text-xl font-bold" style={{ color: '#001F3F' }}>JC</span>
                </div>
                <div>
                  <h4 className="font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>James Chen</h4>
                  <p className="body-text-sm" style={{ color: '#64748B' }}>Marketing Manager</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#50C878">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                ))}
              </div>
              <p className="body-text-sm" style={{ color: '#475569' }}>
                &quot;I struggled for months with my resume. ShortlistPro&apos;s AI suggestions were spot-on - 
                no fake metrics, just honest improvements. Within 2 weeks, I had 5 interview requests. Absolutely worth it!&quot;
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#50C878' }}>
                  <span className="text-xl font-bold" style={{ color: '#001F3F' }}>AP</span>
                </div>
                <div>
                  <h4 className="font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>Aisha Patel</h4>
                  <p className="body-text-sm" style={{ color: '#64748B' }}>Data Analyst</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#50C878">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                ))}
              </div>
              <p className="body-text-sm" style={{ color: '#475569' }}>
                &quot;As a career changer, I had no idea how to format my resume. The country-aware guidance for UK jobs 
                was incredibly helpful. I received multiple offers within a month. This platform is a game-changer!&quot;
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Outfit', color: '#50C878' }}>
                10,000+
              </div>
              <p className="body-text" style={{ color: '#64748B' }}>
                Resumes Created
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Outfit', color: '#50C878' }}>
                95%
              </div>
              <p className="body-text" style={{ color: '#64748B' }}>
                User Satisfaction Rate
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Outfit', color: '#50C878' }}>
                3.2x
              </div>
              <p className="body-text" style={{ color: '#64748B' }}>
                More Interview Callbacks
              </p>
            </div>
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
              Join thousands of professionals who&apos;ve upgraded their career prospects with ShortlistPro.cv.
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
              <Link 
                to="/terms" 
                className="body-text-sm hover:opacity-70 transition-opacity"
                style={{ color: '#001F3F' }}
              >
                Terms of Service
              </Link>
              <a 
                href="mailto:app.hrsupport@gmail.com" 
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
