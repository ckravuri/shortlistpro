import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from '@phosphor-icons/react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FileText size={32} weight="bold" style={{ color: '#001F3F' }} />
            <span className="text-2xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              ShortlistPro.cv
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 btn-secondary"
            style={{ padding: '0.5rem 1.5rem' }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#001F3F', fontFamily: 'Outfit' }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: '#64748B' }}>
          Last Updated: June 22, 2026
        </p>

        <div className="space-y-8" style={{ color: '#334155', lineHeight: '1.8' }}>
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              1. Introduction
            </h2>
            <p>
              Welcome to ShortlistPro.cv ("we," "our," or "us"). We are committed to protecting your
              privacy and ensuring the security of your personal information. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our
              resume building and career services platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: '#0F172A' }}>
              2.1 Personal Information
            </h3>
            <p className="mb-3">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Email address, password, name, and region</li>
              <li><strong>Resume Content:</strong> Professional experience, education, skills, certifications, and other career-related information</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store complete credit card details)</li>
              <li><strong>Profile Data:</strong> Professional headshots, job preferences, and career objectives</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: '#0F172A' }}>
              2.2 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Usage patterns and feature interactions</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              3. How We Use Your Information
            </h2>
            <p className="mb-3">We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Delivery:</strong> To provide resume building, ATS scoring, and career tools</li>
              <li><strong>AI Features:</strong> To generate resume suggestions, professional headshots, and job descriptions using AI technology</li>
              <li><strong>Payment Processing:</strong> To manage subscriptions and process payments through Stripe</li>
              <li><strong>Communication:</strong> To send service updates, subscription notifications, and support responses</li>
              <li><strong>Improvement:</strong> To analyze usage patterns and enhance our platform</li>
              <li><strong>Security:</strong> To detect fraud, prevent abuse, and ensure platform security</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              4. Third-Party Services
            </h2>
            <p className="mb-3">We use the following third-party services:</p>
            
            <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: '#0F172A' }}>
              4.1 Stripe (Payment Processing)
            </h3>
            <p className="mb-3">
              All payment transactions are processed by Stripe, Inc. We do not store complete credit
              card information on our servers. Please review{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Stripe's Privacy Policy
              </a>
              .
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: '#0F172A' }}>
              4.2 Google AdSense (Advertising)
            </h3>
            <p className="mb-3">
              We use Google AdSense to display advertisements. Google may use cookies to serve ads
              based on your visits to our site and other websites. Learn more about{' '}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google's advertising practices
              </a>
              .
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: '#0F172A' }}>
              4.3 AI Services
            </h3>
            <p className="mb-3">
              We use AI language models to provide resume suggestions, content generation, and
              professional headshot creation. Your resume content may be processed by these services
              to generate personalized recommendations.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4" style={{ color: '#0F172A' }}>
              4.4 MongoDB Atlas (Data Storage)
            </h3>
            <p className="mb-3">
              Your data is securely stored using MongoDB Atlas cloud database services with
              industry-standard encryption.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              5. Data Security
            </h2>
            <p className="mb-3">We implement robust security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit using HTTPS/TLS</li>
              <li>Password hashing using bcrypt</li>
              <li>Secure authentication with JWT tokens</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and role-based permissions</li>
            </ul>
            <p className="mt-3">
              However, no method of transmission over the Internet is 100% secure. While we strive
              to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              6. Your Rights
            </h2>
            <p className="mb-3">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Export your resume data in standard formats (PDF/DOCX)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Object:</strong> Object to certain data processing activities</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@shortlistpro.cv" className="text-blue-600 hover:underline">
                privacy@shortlistpro.cv
              </a>
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              7. Data Retention
            </h2>
            <p>
              We retain your personal information for as long as your account is active or as needed
              to provide services. If you delete your account, we will delete or anonymize your data
              within 30 days, except where retention is required by law or for legitimate business
              purposes (e.g., fraud prevention, financial records).
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              8. Cookies and Tracking Technologies
            </h2>
            <p className="mb-3">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Authentication:</strong> To keep you logged in securely</li>
              <li><strong>Preferences:</strong> To remember your settings and choices</li>
              <li><strong>Analytics:</strong> To understand how you use our platform</li>
              <li><strong>Advertising:</strong> To display relevant ads through Google AdSense</li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings, but this may affect platform
              functionality.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              9. Children's Privacy
            </h2>
            <p>
              ShortlistPro.cv is not intended for individuals under the age of 16. We do not
              knowingly collect personal information from children. If you believe we have
              inadvertently collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              10. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries other than your
              country of residence. We ensure appropriate safeguards are in place to protect your
              data in compliance with applicable data protection laws.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              11. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by posting the new policy on this page and updating the "Last Updated" date.
              Your continued use of ShortlistPro.cv after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#001F3F' }}>
              12. Contact Us
            </h2>
            <p className="mb-3">
              If you have questions, concerns, or requests regarding this Privacy Policy or your
              personal data, please contact us:
            </p>
            <div className="bg-white p-6 rounded-lg border" style={{ borderColor: '#E2E8F0' }}>
              <p className="font-semibold mb-2">ShortlistPro.cv Privacy Team</p>
              <p>Email: <a href="mailto:privacy@shortlistpro.cv" className="text-blue-600 hover:underline">privacy@shortlistpro.cv</a></p>
              <p>Support: <a href="mailto:app.hrsupport@gmail.com" className="text-blue-600 hover:underline">app.hrsupport@gmail.com</a></p>
              <p className="mt-3 text-sm" style={{ color: '#64748B' }}>
                We will respond to your inquiry within 30 days.
              </p>
            </div>
          </section>

          {/* Compliance */}
          <section className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#001F3F' }}>
              GDPR & Data Protection Compliance
            </h3>
            <p className="text-sm">
              ShortlistPro.cv is committed to complying with the General Data Protection Regulation
              (GDPR) and other applicable data protection laws. EU residents have specific rights
              regarding their personal data. For GDPR-related inquiries, please contact our Data
              Protection Officer at{' '}
              <a href="mailto:dpo@shortlistpro.cv" className="text-blue-600 hover:underline">
                dpo@shortlistpro.cv
              </a>
            </p>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2"
            style={{ padding: '0.75rem 2rem' }}
          >
            <ArrowLeft size={20} />
            Return to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="border-t mt-20"
        style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="body-text-sm text-center">
            © 2026 ShortlistPro.cv - Professional Resume Builder
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
