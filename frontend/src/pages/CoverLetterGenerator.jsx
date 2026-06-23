import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Sparkle, Download } from '@phosphor-icons/react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CoverLetterGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    skills: '',
    experience: ''
  });
  
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.companyName) {
      setError('Please provide at least job title and company name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post(
        `${API}/generate-cover-letter`,
        formData,
        { withCredentials: true }
      );
      
      setCoverLetter(data.cover_letter);
    } catch (err) {
      console.error('Cover letter generation error:', err);
      setError(err.response?.data?.detail || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${formData.companyName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
          <h1 className="heading-page mb-2">AI Cover Letter Generator</h1>
          <p className="body-text-sm" style={{ color: '#708090' }}>
            Generate professional, tailored cover letters in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="heading-section mb-6">Your Information</h2>
            
            {error && (
              <div className="mb-4 p-3 border-l-4 rounded-sm" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#991B1B' }}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="input-field"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="input-label">Job Title *</label>
                <input
                  type="text"
                  name="jobTitle"
                  className="input-field"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="input-label">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  className="input-field"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Google"
                  required
                />
              </div>

              <div>
                <label className="input-label">Key Skills (Optional)</label>
                <input
                  type="text"
                  name="skills"
                  className="input-field"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Python, Leadership"
                />
              </div>

              <div>
                <label className="input-label">Years of Experience (Optional)</label>
                <input
                  type="text"
                  name="experience"
                  className="input-field"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="5 years"
                />
              </div>

              <div>
                <label className="input-label">Job Description (Optional)</label>
                <textarea
                  name="jobDescription"
                  className="input-field"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Paste the job description here for a more tailored cover letter..."
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Sparkle size={20} weight="fill" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Cover Letter */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-section">Your Cover Letter</h2>
              {coverLetter && (
                <button
                  onClick={handleDownload}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download size={20} />
                  Download
                </button>
              )}
            </div>

            {!coverLetter && !loading && (
              <div className="text-center py-12" style={{ color: '#708090' }}>
                <Sparkle size={48} className="mx-auto mb-4" style={{ opacity: 0.3 }} />
                <p>Fill in the form and click generate to create your cover letter</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#001F3F' }}></div>
                <p style={{ color: '#708090' }}>Generating your cover letter...</p>
              </div>
            )}

            {coverLetter && !loading && (
              <div
                className="prose max-w-none"
                style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.8',
                  color: '#001F3F'
                }}
              >
                {coverLetter}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
