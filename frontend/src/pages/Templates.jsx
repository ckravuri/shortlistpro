import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye } from '@phosphor-icons/react';

const templates = [
  {
    name: 'Modern Professional',
    description: 'Clean, ATS-friendly design perfect for tech and corporate roles',
    preview: '/templates/modern.png',
    type: 'resume'
  },
  {
    name: 'Executive',
    description: 'Sophisticated layout for senior leadership positions',
    preview: '/templates/executive.png',
    type: 'resume'
  },
  {
    name: 'Creative',
    description: 'Stand out with this designer-friendly template',
    preview: '/templates/creative.png',
    type: 'resume'
  },
  {
    name: 'Simple Classic',
    description: 'Minimalist design that works for any industry',
    preview: '/templates/classic.png',
    type: 'resume'
  },
  {
    name: 'Technical',
    description: 'Optimized for developers and engineers',
    preview: '/templates/technical.png',
    type: 'resume'
  }
];

const coverLetterExamples = [
  {
    name: 'Software Engineer',
    description: 'Tech industry cover letter example',
    industry: 'Technology'
  },
  {
    name: 'Marketing Manager',
    description: 'Marketing role cover letter sample',
    industry: 'Marketing'
  },
  {
    name: 'Financial Analyst',
    description: 'Finance sector cover letter template',
    industry: 'Finance'
  }
];

export const Templates = () => {
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
        {/* Resume Templates */}
        <section className="mb-16">
          <div className="mb-8">
            <h1 className="heading-page mb-2">Resume Templates</h1>
            <p className="body-text-sm" style={{ color: '#708090' }}>
              Professional, ATS-optimized templates to make you stand out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <div key={index} className="card group hover:shadow-lg transition-all duration-300">
                <div
                  className="aspect-[8.5/11] mb-4 rounded-lg border flex items-center justify-center overflow-hidden"
                  style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                >
                  <FileText size={64} style={{ color: '#CBD5E1' }} />
                </div>
                <h3 className="heading-section mb-2">{template.name}</h3>
                <p className="body-text-sm mb-4" style={{ color: '#708090' }}>
                  {template.description}
                </p>
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                    <Eye size={18} />
                    Preview
                  </button>
                  <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Download size={18} />
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cover Letter Examples */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#001F3F', fontFamily: 'Outfit' }}>
              Cover Letter Examples
            </h2>
            <p className="body-text-sm" style={{ color: '#708090' }}>
              Industry-specific cover letter samples to guide your writing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coverLetterExamples.map((example, index) => (
              <div key={index} className="card hover:shadow-lg transition-all duration-300">
                <div className="mb-4 inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#10B98115', color: '#10B981' }}>
                  {example.industry}
                </div>
                <h3 className="heading-section mb-2">{example.name}</h3>
                <p className="body-text-sm mb-4" style={{ color: '#708090' }}>
                  {example.description}
                </p>
                <button className="btn-secondary w-full">
                  View Example
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 card text-center" style={{ backgroundColor: '#001F3F' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Need a Custom Template?
          </h2>
          <p className="mb-6" style={{ color: '#E2E8F0' }}>
            Use our AI Resume Builder to create a personalized resume from scratch
          </p>
          <Link to="/dashboard" className="btn-primary" style={{ backgroundColor: '#10B981' }}>
            Start Building
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Templates;