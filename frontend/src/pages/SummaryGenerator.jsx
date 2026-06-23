import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Sparkle, Copy, Check } from '@phosphor-icons/react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const SummaryGenerator = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    currentRole: '',
    yearsOfExperience: '',
    keySkills: '',
    targetRole: '',
    achievements: ''
  });
  
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.currentRole && !formData.keySkills) {
      setError('Please provide at least your current role or key skills');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post(
        `${API}/generate-summary`,
        formData,
        { withCredentials: true }
      );
      
      setSummary(data.summary || '');
    } catch (err) {
      console.error('Summary generation error:', err);
      setError(err.response?.data?.detail || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="heading-page mb-2">AI Resume Summary Generator</h1>
          <p className="body-text-sm" style={{ color: '#708090' }}>
            Create a compelling professional summary that captures your value
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="heading-section mb-6">Your Background</h2>
            
            {error && (
              <div className="mb-4 p-3 border-l-4 rounded-sm" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#991B1B' }}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="input-label">Current/Recent Role</label>
                <input
                  type="text"
                  name="currentRole"
                  className="input-field"
                  value={formData.currentRole}
                  onChange={handleChange}
                  placeholder="Senior Software Engineer"
                />
              </div>

              <div>
                <label className="input-label">Years of Experience</label>
                <input
                  type="text"
                  name="yearsOfExperience"
                  className="input-field"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="5 years"
                />
              </div>

              <div>
                <label className="input-label">Key Skills *</label>
                <input
                  type="text"
                  name="keySkills"
                  className="input-field"
                  value={formData.keySkills}
                  onChange={handleChange}
                  placeholder="React, Python, AWS, Team Leadership"
                  required
                />
              </div>

              <div>
                <label className="input-label">Target Role (Optional)</label>
                <input
                  type="text"
                  name="targetRole"
                  className="input-field"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="Engineering Manager"
                />
              </div>

              <div>
                <label className="input-label">Key Achievements (Optional)</label>
                <textarea
                  name="achievements"
                  className="input-field"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Led team of 10, launched 3 products, 40% efficiency improvement..."
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
                    Generate Summary
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Summary */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-section">Professional Summary</h2>
              {summary && (
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={18} style={{ color: '#10B981' }} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            {!summary && !loading && (
              <div className="text-center py-12" style={{ color: '#708090' }}>
                <Sparkle size={48} className="mx-auto mb-4" style={{ opacity: 0.3 }} />
                <p>Fill in your details and click generate</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#001F3F' }}></div>
                <p style={{ color: '#708090' }}>Creating your professional summary...</p>
              </div>
            )}

            {summary && !loading && (
              <div
                className="p-6 rounded-lg border"
                style={{
                  borderColor: '#10B981',
                  backgroundColor: '#F0FDF4',
                  lineHeight: '1.8',
                  color: '#001F3F'
                }}
              >
                {summary}
              </div>
            )}

            {/* Tips */}
            {!summary && !loading && (
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FEF9E7', borderLeft: '4px solid #F59E0B' }}>
                <h3 className="font-semibold mb-2" style={{ color: '#92400E' }}>What Makes a Great Summary:</h3>
                <ul className="text-sm space-y-1" style={{ color: '#92400E' }}>
                  <li>• 2-3 sentences highlighting your value</li>
                  <li>• Mention years of experience & key skills</li>
                  <li>• Include 1-2 major achievements</li>
                  <li>• Show what makes you unique</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryGenerator;