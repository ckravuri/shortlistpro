import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle } from '@phosphor-icons/react';

export const Templates = () => {
  const navigate = useNavigate();

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, ATS-friendly design perfect for most industries',
      preview: '📄',
      features: ['ATS-optimized', 'Clean layout', 'Professional']
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated layout for senior-level professionals',
      preview: '📋',
      features: ['Leadership focus', 'Bold headings', 'Impact-driven']
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Stand out with a designer-friendly template',
      preview: '🎨',
      features: ['Visual appeal', 'Color accents', 'Unique layout']
    },
  ];

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
          <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="heading-page mb-2">Resume Templates</h1>
          <p className="body-text-sm" style={{ color: '#708090' }}>
            Professional, ATS-friendly resume templates (All resumes created in ShortlistPro use optimized formatting)
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-6 rounded-lg border-l-4" style={{ backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }}>
          <h3 className="font-semibold mb-2" style={{ color: '#1E40AF' }}>
            ✨ All ShortlistPro Resumes are ATS-Optimized
          </h3>
          <p className="body-text-sm" style={{ color: '#1E40AF' }}>
            Every resume you create in ShortlistPro.cv automatically uses our professionally designed, 
            ATS-safe format. No need to choose a template – we've done the hard work for you! 
            Simply focus on your content, and we'll ensure it passes through Applicant Tracking Systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div 
                className="w-full h-48 rounded-lg flex items-center justify-center text-6xl mb-4"
                style={{ backgroundColor: '#F8FAFC', border: '2px dashed #E2E8F0' }}
              >
                {template.preview}
              </div>
              
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                {template.name}
              </h3>
              
              <p className="body-text-sm mb-4" style={{ color: '#708090' }}>
                {template.description}
              </p>

              <div className="space-y-2 mb-4">
                {template.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" style={{ color: '#50C878' }} />
                    <span className="body-text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary w-full"
              >
                Use This Format
              </button>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center p-8 rounded-lg" style={{ backgroundColor: '#FFF9E6', border: '1px solid #F59E0B' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#92400E' }}>
            🚀 More Templates Coming Soon!
          </h3>
          <p className="body-text-sm" style={{ color: '#92400E' }}>
            We're working on industry-specific templates for tech, healthcare, education, and more. 
            For now, all resumes use our proven ATS-optimized format.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Templates;
