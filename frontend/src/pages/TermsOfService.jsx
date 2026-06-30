import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from '@phosphor-icons/react';

export const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={40} weight="bold" style={{ color: '#001F3F' }} />
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
            Terms of Service
          </h1>
        </div>

        <p className="body-text mb-8" style={{ color: '#64748B' }}>
          Last Updated: December 30, 2025
        </p>

        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              1. Agreement to Terms
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                By accessing and using ShortlistPro.cv (&quot;Service&quot;, &quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), 
                you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these 
                Terms, please do not use our Service.
              </p>
              <p>
                ShortlistPro.cv is a professional resume building platform that provides AI-powered tools 
                to help users create, edit, and optimize their resumes for job applications.
              </p>
            </div>
          </section>

          {/* Account Terms */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              2. Account Terms
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                <strong>Registration:</strong> You must provide accurate and complete information when 
                creating your account. You are responsible for maintaining the security of your account 
                credentials.
              </p>
              <p>
                <strong>Age Requirement:</strong> You must be at least 16 years old to use this Service.
              </p>
              <p>
                <strong>Account Security:</strong> You are responsible for all activities that occur under 
                your account. Notify us immediately of any unauthorized use of your account.
              </p>
              <p>
                <strong>One Account Per User:</strong> You may only create one account. Multiple accounts 
                for the same person are prohibited.
              </p>
            </div>
          </section>

          {/* Subscription and Payment Terms */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              3. Subscription and Payment Terms
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                <strong>Subscription Tiers:</strong> We offer three subscription tiers:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Free:</strong> Limited to 1 resume, 5 AI suggestions, basic templates</li>
                <li><strong>Pro ($7.99/month):</strong> Up to 10 resumes, unlimited AI suggestions, all templates, ATS scoring, priority support</li>
                <li><strong>Pro+ ($14.99/month):</strong> Unlimited resumes, unlimited AI suggestions, all features, AI headshots, priority support</li>
              </ul>
              <p>
                <strong>Billing:</strong> Subscription fees are billed monthly in advance. Payment is processed 
                through Stripe, our secure payment processor.
              </p>
              <p>
                <strong>Automatic Renewal:</strong> Your subscription will automatically renew unless you cancel 
                before the renewal date.
              </p>
              <p>
                <strong>Cancellation:</strong> You may cancel your subscription at any time. Cancellation takes 
                effect at the end of the current billing period. No refunds for partial months.
              </p>
              <p>
                <strong>Refund Policy:</strong> We offer a 7-day money-back guarantee for first-time subscribers. 
                Contact support@shortlistpro.cv within 7 days of your initial purchase for a full refund.
              </p>
              <p>
                <strong>Price Changes:</strong> We reserve the right to change subscription prices with 30 days&apos; 
                notice to existing subscribers.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              4. Acceptable Use Policy
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>You agree NOT to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction (including copyright laws)</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Attempt to bypass rate limits or abuse AI features</li>
                <li>Create fake or misleading resumes with false information</li>
                <li>Share your account credentials with others</li>
                <li>Scrape, harvest, or collect data from the Service using automated means</li>
                <li>Reverse engineer or attempt to access our source code</li>
                <li>Use the Service to spam or harass others</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              5. Intellectual Property
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                <strong>Your Content:</strong> You retain all rights to the content you create (resumes, cover letters, etc.). 
                By using our Service, you grant us a limited license to store, process, and display your content 
                to provide the Service.
              </p>
              <p>
                <strong>Our Platform:</strong> The ShortlistPro.cv platform, including all code, designs, templates, 
                and AI models, is our intellectual property. You may not copy, modify, or distribute our platform.
              </p>
              <p>
                <strong>AI-Generated Content:</strong> Content generated by our AI tools is provided to you for your use. 
                However, you are responsible for reviewing and verifying all AI-generated content before use.
              </p>
            </div>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              6. Disclaimer of Warranties
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTIES OF ANY KIND, 
                EXPRESS OR IMPLIED.
              </p>
              <p>
                <strong>We do not guarantee:</strong>
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>That you will get a job or interview using our Service</li>
                <li>That AI-generated content is error-free or accurate</li>
                <li>That the Service will be uninterrupted or error-free</li>
                <li>That ATS scores are 100% accurate (they are estimates)</li>
                <li>That templates will pass all ATS systems</li>
              </ul>
              <p>
                <strong>Your Responsibility:</strong> You are solely responsible for the accuracy and truthfulness 
                of your resume content. Always review AI-generated suggestions before using them.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              7. Limitation of Liability
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SHORTLISTPRO.CV SHALL NOT BE LIABLE FOR ANY 
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT 
                LIMITED TO LOSS OF PROFITS, DATA, OR EMPLOYMENT OPPORTUNITIES.
              </p>
              <p>
                OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM YOUR USE OF THE SERVICE SHALL 
                NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
              </p>
            </div>
          </section>

          {/* Data and Privacy */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              8. Data and Privacy
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                Your use of the Service is also governed by our{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </p>
              <p>
                <strong>Data Retention:</strong> We retain your data as long as your account is active. 
                Upon account deletion, your data is permanently removed within 30 days.
              </p>
              <p>
                <strong>Data Security:</strong> We implement industry-standard security measures to protect 
                your data. However, no method of transmission over the Internet is 100% secure.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              9. Termination
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                <strong>By You:</strong> You may delete your account at any time from your account settings.
              </p>
              <p>
                <strong>By Us:</strong> We reserve the right to suspend or terminate your account if you 
                violate these Terms, abuse the Service, or engage in fraudulent activity.
              </p>
              <p>
                <strong>Effect of Termination:</strong> Upon termination, your access to the Service will 
                cease immediately. You may export your data before terminating your account.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              10. Dispute Resolution and Governing Law
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                <strong>Informal Resolution:</strong> If you have a dispute, please contact us at 
                support@shortlistpro.cv first to resolve it informally.
              </p>
              <p>
                <strong>Governing Law:</strong> These Terms are governed by the laws of [Your Jurisdiction], 
                without regard to conflict of law principles.
              </p>
              <p>
                <strong>Arbitration:</strong> Any disputes that cannot be resolved informally shall be 
                resolved through binding arbitration in accordance with [Arbitration Rules].
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              11. Changes to These Terms
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                We may update these Terms from time to time. We will notify you of material changes by:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Posting the updated Terms on this page</li>
                <li>Updating the &quot;Last Updated&quot; date</li>
                <li>Sending an email notification for significant changes</li>
              </ul>
              <p>
                Your continued use of the Service after changes constitutes acceptance of the updated Terms.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-lg p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              12. Contact Information
            </h2>
            <div className="space-y-3 body-text" style={{ color: '#475569' }}>
              <p>
                If you have questions about these Terms, please contact us:
              </p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> support@shortlistpro.cv</li>
                <li><strong>Website:</strong> https://shortlistpro.cv</li>
              </ul>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="body-text" style={{ color: '#001F3F' }}>
              <strong>By using ShortlistPro.cv, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms of Service.</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
