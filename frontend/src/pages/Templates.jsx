import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Star, Download, Eye } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';

export const Templates = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumes'); // 'resumes' or 'coverletters'

  const resumeTemplates = [
    {
      id: 'harvard',
      name: 'Harvard',
      category: 'Professional',
      description: 'Top student-favorite Harvard template for any job',
      rating: 5,
      recommended: true,
      roles: ['All Roles', 'Students', 'Entry Level']
    },
    {
      id: 'modern-professional',
      name: 'Modern Professional',
      category: 'Clean',
      description: 'Clean, ATS-friendly design perfect for corporate roles',
      rating: 5,
      recommended: true,
      roles: ['Manager', 'Analyst', 'Consultant']
    },
    {
      id: 'executive',
      name: 'Executive',
      category: 'Bold',
      description: 'Sophisticated layout for senior leadership positions',
      rating: 4,
      recommended: false,
      roles: ['Executive', 'Director', 'VP']
    },
    {
      id: 'technical',
      name: 'Tech Pro',
      category: 'Modern',
      description: 'Optimized for software engineers and tech roles',
      rating: 5,
      recommended: true,
      roles: ['Software Engineer', 'Developer', 'Architect']
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      category: 'Simple',
      description: 'Stripped-down layout for maximum ATS compatibility',
      rating: 4,
      recommended: false,
      roles: ['All Roles', 'Career Changers']
    },
    {
      id: 'creative',
      name: 'Creative Pro',
      category: 'Design',
      description: 'Stand out with this designer-friendly template',
      rating: 4,
      recommended: false,
      roles: ['Designer', 'Creative', 'Marketing']
    },
  ];

  const coverLetterExamples = [
    {
      id: 'software-engineer',
      role: 'Software Engineer',
      company: 'Tech Company',
      description: 'Technical role emphasizing problem-solving and coding skills',
      excerpt: 'Experienced software engineer with 5+ years building scalable applications...',
      rating: 5
    },
    {
      id: 'data-analyst',
      role: 'Data Analyst',
      company: 'Analytics Firm',
      description: 'Data-driven role highlighting analytical and visualization skills',
      excerpt: 'Detail-oriented analyst skilled in SQL, Python, and turning data into insights...',
      rating: 5
    },
    {
      id: 'product-manager',
      role: 'Product Manager',
      company: 'SaaS Company',
      description: 'Leadership role showcasing strategy and cross-functional collaboration',
      excerpt: 'Product leader with track record of launching customer-centric solutions...',
      rating: 4
    },
    {
      id: 'marketing-manager',
      role: 'Marketing Manager',
      company: 'E-commerce Brand',
      description: 'Marketing role emphasizing campaigns and growth metrics',
      excerpt: 'Results-driven marketer who increased customer acquisition by 150%...',
      rating: 5
    },
    {
      id: 'solutions-architect',
      role: 'Solutions Architect',
      company: 'Cloud Provider',
      description: 'Technical architecture role for enterprise solutions',
      excerpt: 'Cloud architect with expertise in AWS, Azure designing scalable systems...',
      rating: 4
    },
    {
      id: 'business-analyst',
      role: 'Business Analyst',
      company: 'Consulting Firm',
      description: 'Strategic role bridging business needs and technical solutions',
      excerpt: 'Business analyst with proven ability to translate requirements into solutions...',
      rating: 5
    },
  ];

  const TemplatePreview = ({ template }) => (
    <div className="card hover:shadow-xl transition-all duration-300 group">
      {/* Preview Image */}
      <div 
        className="relative w-full h-64 rounded-lg mb-4 overflow-hidden border-2 group-hover:border-emerald-400 transition-colors"
        style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
      >
        {/* Simulated Resume Preview */}
        <div className="absolute inset-0 p-4 text-xs" style={{ color: '#708090' }}>
          <div className="font-bold text-base mb-1" style={{ color: '#001F3F' }}>John Doe</div>
          <div className="mb-3">john.doe@email.com | (555) 123-4567</div>
          <div className="border-b-2 mb-2" style={{ borderColor: '#50C878', width: '60%' }}></div>
          <div className="font-semibold mb-1" style={{ color: '#001F3F' }}>PROFESSIONAL SUMMARY</div>
          <div className="mb-2 opacity-60">Experienced professional with proven track record...</div>
          <div className="font-semibold mb-1" style={{ color: '#001F3F' }}>EXPERIENCE</div>
          <div className="mb-1 opacity-60">Senior Role • Company Name • 2020-Present</div>
          <div className="opacity-40 text-xs">• Achievement with quantified results<br/>• Led team of X professionals</div>
        </div>
        
        {template.recommended && (
          <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold"
               style={{ backgroundColor: '#50C878', color: 'white' }}>
            Recommended
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
            {template.name}
          </h3>
          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
            {template.category}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(template.rating)].map((_, i) => (
            <Star key={i} size={14} weight="fill" style={{ color: '#F59E0B' }} />
          ))}
        </div>
      </div>

      <p className="body-text-sm mb-3" style={{ color: '#708090' }}>
        {template.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {template.roles.map((role, idx) => (
          <span key={idx} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#F0FDF4', color: '#166534' }}>
            {role}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <FileText size={16} weight="bold" />
          Use Template
        </button>
        <button className="btn-secondary px-4">
          <Eye size={18} weight="bold" />
        </button>
      </div>
    </div>
  );

  const CoverLetterCard = ({ example }) => (
    <div className="card hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
            {example.role}
          </h3>
          <p className="body-text-sm" style={{ color: '#708090' }}>
            {example.company}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(example.rating)].map((_, i) => (
            <Star key={i} size={14} weight="fill" style={{ color: '#F59E0B' }} />
          ))}
        </div>
      </div>

      <p className="body-text-sm mb-3" style={{ color: '#708090' }}>
        {example.description}
      </p>

      {/* Preview Box */}
      <div className="p-4 rounded-lg mb-4 border-l-4" style={{ backgroundColor: '#F8FAFC', borderColor: '#50C878' }}>
        <p className="text-sm italic" style={{ color: '#001F3F' }}>
          "{example.excerpt}"
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate('/cover-letter')}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <FileText size={16} weight="bold" />
          Generate Similar
        </button>
        <button className="btn-secondary px-4">
          <Eye size={18} weight="bold" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="heading-page mb-3">Professional Templates & Examples</h1>
          <p className="body-text" style={{ color: '#708090', maxWidth: '600px', margin: '0 auto' }}>
            ATS-optimized templates and real-world examples to help you stand out
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('resumes')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'resumes'
                ? 'shadow-md'
                : ''
            }`}
            style={{
              backgroundColor: activeTab === 'resumes' ? '#001F3F' : 'white',
              color: activeTab === 'resumes' ? 'white' : '#001F3F',
              border: activeTab === 'resumes' ? 'none' : '2px solid #E2E8F0'
            }}
          >
            Resume Templates ({resumeTemplates.length})
          </button>
          <button
            onClick={() => setActiveTab('coverletters')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'coverletters'
                ? 'shadow-md'
                : ''
            }`}
            style={{
              backgroundColor: activeTab === 'coverletters' ? '#001F3F' : 'white',
              color: activeTab === 'coverletters' ? 'white' : '#001F3F',
              border: activeTab === 'coverletters' ? 'none' : '2px solid #E2E8F0'
            }}
          >
            Cover Letter Examples ({coverLetterExamples.length})
          </button>
        </div>

        {/* Resume Templates */}
        {activeTab === 'resumes' && (
          <>
            <div className="mb-8 p-6 rounded-lg border-l-4" style={{ backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1E40AF' }}>
                ✨ All Templates Are ATS-Optimized
              </h3>
              <p className="body-text-sm" style={{ color: '#1E40AF' }}>
                Every template is designed to pass Applicant Tracking Systems while looking professional. 
                Choose based on your industry and style preference - they're all ATS-safe!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumeTemplates.map((template) => (
                <TemplatePreview key={template.id} template={template} />
              ))}
            </div>
          </>
        )}

        {/* Cover Letter Examples */}
        {activeTab === 'coverletters' && (
          <>
            <div className="mb-8 p-6 rounded-lg border-l-4" style={{ backgroundColor: '#F0FDF4', borderColor: '#50C878' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#166534' }}>
                📝 Role-Specific Cover Letter Examples
              </h3>
              <p className="body-text-sm" style={{ color: '#166534' }}>
                Real-world examples tailored to different job roles. Use our AI Cover Letter Generator to 
                create a personalized version for your target position.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coverLetterExamples.map((example) => (
                <CoverLetterCard key={example.id} example={example} />
              ))}
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center p-8 rounded-lg" style={{ backgroundColor: '#FFF9E6', border: '2px solid #F59E0B' }}>
          <h3 className="text-xl font-semibold mb-3" style={{ color: '#92400E' }}>
            Ready to Build Your Resume?
          </h3>
          <p className="body-text mb-4" style={{ color: '#92400E' }}>
            Start with any template and our AI tools will help you craft the perfect resume
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Templates;
