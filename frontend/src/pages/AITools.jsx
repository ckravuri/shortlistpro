import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkle, ListBullets, TextAlignLeft, UserCircle, Briefcase, MagnifyingGlass, Target } from '@phosphor-icons/react';

const tools = [
  {
    name: 'AI Resume Builder',
    description: 'Create ATS-optimized resumes with AI-powered suggestions',
    icon: FileText,
    path: '/dashboard',
    color: '#10B981'
  },
  {
    name: 'Cover Letter Generator',
    description: 'Generate tailored cover letters instantly',
    icon: TextAlignLeft,
    path: '/cover-letter',
    color: '#3B82F6'
  },
  {
    name: 'Resume Bullet Point Writer',
    description: 'Transform experiences into powerful bullet points',
    icon: ListBullets,
    path: '/bullet-writer',
    color: '#8B5CF6'
  },
  {
    name: 'Resume Summary Generator',
    description: 'Create compelling professional summaries',
    icon: Sparkle,
    path: '/summary-generator',
    color: '#F59E0B'
  },
  {
    name: 'ATS Score Checker',
    description: 'Check how well your resume passes ATS systems',
    icon: MagnifyingGlass,
    path: '/dashboard',
    color: '#EF4444'
  },
  {
    name: 'Professional Headshot Generator',
    description: 'Create AI-generated professional headshots',
    icon: UserCircle,
    path: '/headshot',
    color: '#06B6D4'
  },
  {
    name: 'STAR Builder',
    description: 'Structure interview responses using STAR method',
    icon: Target,
    path: '/star',
    color: '#EC4899'
  },
  {
    name: 'Job Ad Optimizer',
    description: 'Tailor your resume to specific job descriptions',
    icon: Briefcase,
    path: '/job-ad',
    color: '#14B8A6'
  }
];

export const AITools = () => {
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
          <Link to="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="heading-page mb-4">AI-Powered Career Tools</h1>
          <p className="text-lg" style={{ color: '#708090' }}>
            Professional tools to accelerate your job search
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={index}
                to={tool.path}
                className="card hover:shadow-lg transition-all duration-300 group"
                style={{
                  borderLeft: `4px solid ${tool.color}`
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{
                      backgroundColor: `${tool.color}15`
                    }}
                  >
                    <Icon size={32} weight="bold" style={{ color: tool.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-section mb-2 group-hover:opacity-70 transition-opacity">
                      {tool.name}
                    </h3>
                    <p className="body-text-sm" style={{ color: '#708090' }}>
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 card text-center" style={{ background: 'linear-gradient(135deg, #001F3F 0%, #10B981 100%)' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Unlock All AI Tools
          </h2>
          <p className="mb-6" style={{ color: '#E2E8F0' }}>
            Upgrade to Pro+ for unlimited access to all AI-powered features
          </p>
          <Link to="/pricing" className="btn-primary" style={{ backgroundColor: '#FFFFFF', color: '#001F3F' }}>
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AITools;