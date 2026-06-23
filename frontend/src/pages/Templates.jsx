import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Star, Eye, X } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Templates = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumes'); // 'resumes' or 'coverletters'
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [creating, setCreating] = useState(false);

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
      fullText: `Dear Hiring Manager,

I am writing to express my strong interest in the Software Engineer position at [Company Name]. With over 5 years of experience building scalable applications and a proven track record of delivering high-quality software solutions, I am excited about the opportunity to contribute to your engineering team.

In my current role at [Current Company], I have successfully led the development of multiple full-stack applications that serve over 100,000 users. My expertise spans React, Node.js, Python, and cloud technologies including AWS and Azure. I particularly excel at architecting systems that are both performant and maintainable.

What excites me most about this opportunity is [Company Name]'s commitment to innovation and technical excellence. I am particularly drawn to your work on [specific project/product], and I believe my experience in building similar systems would allow me to make immediate contributions to your team.

I would welcome the opportunity to discuss how my technical skills and passion for building great software can benefit [Company Name]. Thank you for considering my application.

Sincerely,
[Your Name]`,
      rating: 5
    },
    {
      id: 'data-analyst',
      role: 'Data Analyst',
      company: 'Analytics Firm',
      description: 'Data-driven role highlighting analytical and visualization skills',
      excerpt: 'Detail-oriented analyst skilled in SQL, Python, and turning data into insights...',
      fullText: `Dear Hiring Manager,

I am excited to apply for the Data Analyst position at [Company Name]. With a strong background in statistical analysis, data visualization, and business intelligence, I am confident in my ability to help drive data-informed decision-making across your organization.

In my previous role at [Current Company], I developed dashboards and reports that provided actionable insights to stakeholders across multiple departments. Using SQL, Python, and Tableau, I transformed complex datasets into clear visualizations that directly influenced strategic business decisions and resulted in a 25% improvement in operational efficiency.

I am particularly impressed by [Company Name]'s data-driven culture and commitment to leveraging analytics for business growth. My experience in A/B testing, predictive modeling, and creating automated reporting systems aligns perfectly with your team's needs.

I would love to discuss how my analytical skills and passion for turning data into actionable insights can contribute to [Company Name]'s success.

Best regards,
[Your Name]`,
      rating: 5
    },
    {
      id: 'product-manager',
      role: 'Product Manager',
      company: 'SaaS Company',
      description: 'Leadership role showcasing strategy and cross-functional collaboration',
      excerpt: 'Product leader with track record of launching customer-centric solutions...',
      fullText: `Dear Hiring Manager,

I am writing to express my interest in the Product Manager position at [Company Name]. With over 6 years of experience leading cross-functional teams and launching successful products, I am excited about the opportunity to drive product strategy and execution at your organization.

Throughout my career, I have successfully managed the entire product lifecycle from discovery to launch. At [Current Company], I led a team that launched three major features that increased user engagement by 45% and generated $2M in additional revenue. My approach combines data-driven decision-making with a deep understanding of user needs and market dynamics.

What attracts me to [Company Name] is your mission to [company mission] and your innovative approach to solving [specific problem]. I believe my experience in SaaS product development and my passion for building products that users love would make me a strong addition to your team.

I would welcome the opportunity to discuss how my product management expertise can help [Company Name] achieve its goals.

Sincerely,
[Your Name]`,
      rating: 4
    },
    {
      id: 'marketing-manager',
      role: 'Marketing Manager',
      company: 'E-commerce Brand',
      description: 'Marketing role emphasizing campaigns and growth metrics',
      excerpt: 'Results-driven marketer who increased customer acquisition by 150%...',
      fullText: `Dear Hiring Manager,

I am excited to apply for the Marketing Manager position at [Company Name]. With a proven track record of developing and executing successful marketing campaigns that drive customer acquisition and revenue growth, I am confident I can help [Company Name] achieve its marketing objectives.

In my current role at [Current Company], I led a team that increased customer acquisition by 150% year-over-year through a combination of digital marketing, content strategy, and data-driven optimization. I have extensive experience with SEO, paid advertising, email marketing, and social media campaigns across multiple platforms.

I am particularly drawn to [Company Name] because of your innovative products and strong brand presence in the market. I believe my experience in e-commerce marketing and my passion for building data-driven campaigns would enable me to make immediate contributions to your team.

I look forward to the opportunity to discuss how I can help drive [Company Name]'s marketing success.

Best regards,
[Your Name]`,
      rating: 5
    },
    {
      id: 'solutions-architect',
      role: 'Solutions Architect',
      company: 'Cloud Provider',
      description: 'Technical architecture role for enterprise solutions',
      excerpt: 'Cloud architect with expertise in AWS, Azure designing scalable systems...',
      fullText: `Dear Hiring Manager,

I am writing to express my interest in the Solutions Architect position at [Company Name]. With over 8 years of experience designing and implementing enterprise-scale cloud solutions, I am excited about the opportunity to help your clients build robust, scalable architectures.

Throughout my career, I have worked extensively with AWS, Azure, and GCP, designing solutions for companies ranging from startups to Fortune 500 enterprises. At [Current Company], I led the architecture and implementation of a multi-region cloud infrastructure that improved system reliability to 99.99% uptime while reducing costs by 30%.

I am particularly impressed by [Company Name]'s commitment to innovation and technical excellence in the cloud space. My expertise in microservices architecture, containerization, and infrastructure as code would enable me to provide valuable guidance to your clients and contribute to your team's success.

I would welcome the opportunity to discuss how my architectural expertise can benefit [Company Name] and your clients.

Sincerely,
[Your Name]`,
      rating: 4
    },
    {
      id: 'business-analyst',
      role: 'Business Analyst',
      company: 'Consulting Firm',
      description: 'Strategic role bridging business needs and technical solutions',
      excerpt: 'Business analyst with proven ability to translate requirements into solutions...',
      fullText: `Dear Hiring Manager,

I am excited to apply for the Business Analyst position at [Company Name]. With a strong background in requirements gathering, process improvement, and stakeholder management, I am confident in my ability to help bridge the gap between business needs and technical solutions.

In my role at [Current Company], I have successfully led multiple business transformation projects, working closely with stakeholders to identify pain points and design solutions that improved operational efficiency by 35%. My expertise includes process mapping, user story development, and facilitating workshops with cross-functional teams.

What attracts me to [Company Name] is your reputation for delivering high-quality consulting services and your commitment to client success. I believe my analytical skills and experience in translating complex business requirements into actionable solutions would make me a valuable addition to your consulting team.

I look forward to discussing how I can contribute to [Company Name]'s continued success.

Best regards,
[Your Name]`,
      rating: 5
    },
  ];

  const handleUseTemplate = async (template) => {
    setCreating(true);
    try {
      // Create a new resume with the template style
      const response = await axios.post(`${API}/resumes`, {
        title: `New Resume - ${template.name}`,
        region: 'US',
        template: template.id
      }, { withCredentials: true });
      
      // Navigate to resume builder with the new resume
      navigate(`/resume/${response.data.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      alert('Failed to create resume. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseCoverLetter = (example) => {
    // Navigate to cover letter generator with example pre-filled
    navigate('/cover-letter', { state: { example: example.fullText } });
  };

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
          onClick={() => handleUseTemplate(template)}
          disabled={creating}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <FileText size={16} weight="bold" />
          {creating ? 'Creating...' : 'Use Template'}
        </button>
        <button 
          onClick={() => handleViewTemplate(template)}
          className="btn-secondary px-4"
        >
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
          onClick={() => handleUseCoverLetter(example)}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <FileText size={16} weight="bold" />
          Use This Example
        </button>
        <button 
          onClick={() => {
            setSelectedTemplate(example);
            setShowPreview(true);
          }}
          className="btn-secondary px-4"
        >
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

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
              <div>
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                  {selectedTemplate.name || selectedTemplate.role}
                </h2>
                <p className="body-text-sm mt-1" style={{ color: '#708090' }}>
                  {selectedTemplate.description || selectedTemplate.company}
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} style={{ color: '#708090' }} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              {activeTab === 'resumes' ? (
                // Resume Preview
                <div className="border-2 rounded-lg p-8" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                  <div className="bg-white p-8 rounded shadow-sm">
                    <div className="text-center mb-6">
                      <h1 className="text-3xl font-bold mb-2" style={{ color: '#001F3F' }}>John Doe</h1>
                      <p className="text-sm" style={{ color: '#708090' }}>
                        john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe
                      </p>
                    </div>

                    <div className="mb-4">
                      <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: '#001F3F', borderColor: '#50C878' }}>
                        PROFESSIONAL SUMMARY
                      </h2>
                      <p className="text-sm" style={{ color: '#001F3F' }}>
                        Experienced professional with proven track record of delivering results in fast-paced environments. 
                        Strong analytical skills combined with excellent communication abilities and a passion for continuous improvement.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: '#001F3F', borderColor: '#50C878' }}>
                        WORK EXPERIENCE
                      </h2>
                      <div className="mb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm" style={{ color: '#001F3F' }}>Senior Role • Company Name</h3>
                            <p className="text-xs" style={{ color: '#708090' }}>Location</p>
                          </div>
                          <span className="text-xs" style={{ color: '#708090' }}>2020 - Present</span>
                        </div>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1" style={{ color: '#001F3F' }}>
                          <li>Led team of 5 professionals to achieve 25% improvement in key metrics</li>
                          <li>Implemented new processes that reduced costs by $100K annually</li>
                          <li>Collaborated with cross-functional teams on strategic initiatives</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: '#001F3F', borderColor: '#50C878' }}>
                        EDUCATION
                      </h2>
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold text-sm" style={{ color: '#001F3F' }}>Bachelor of Science in Business</h3>
                          <p className="text-xs" style={{ color: '#708090' }}>University Name</p>
                        </div>
                        <span className="text-xs" style={{ color: '#708090' }}>2016 - 2020</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: '#001F3F', borderColor: '#50C878' }}>
                        SKILLS
                      </h2>
                      <p className="text-sm" style={{ color: '#001F3F' }}>
                        Project Management • Data Analysis • Communication • Leadership • Problem Solving • Excel • SQL
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Cover Letter Preview
                <div className="border-2 rounded-lg p-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm" style={{ color: '#001F3F', lineHeight: '1.8' }}>
                      {selectedTemplate.fullText}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t" style={{ borderColor: '#E2E8F0' }}>
              <button
                onClick={() => setShowPreview(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  if (activeTab === 'resumes') {
                    handleUseTemplate(selectedTemplate);
                  } else {
                    handleUseCoverLetter(selectedTemplate);
                  }
                }}
                className="btn-primary flex-1"
              >
                Use This {activeTab === 'resumes' ? 'Template' : 'Example'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
