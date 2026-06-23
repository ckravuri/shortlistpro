import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Target, Copy, Check } from '@phosphor-icons/react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const SelectionCriteria = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    question: '',
    resumeContext: ''
  });
  
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.question || !formData.resumeContext) {
      setError('Please provide both the selection criteria question and your resume/experience details');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post(
        `${API}/generate-selection-criteria`,
        formData,
        { withCredentials: true }
      );
      
      setResponse(data.response || '');
    } catch (err) {
      console.error('Selection criteria generation error:', err);
      setError(err.response?.data?.detail || 'Failed to generate response');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
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
          <h1 className="heading-page mb-2">Response to Selection Criteria</h1>
          <p className="body-text-sm" style={{ color: '#708090' }}>
            Generate STAR-format responses to selection criteria questions using your resume
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
                <label className="input-label">Selection Criteria Question *</label>
                <textarea
                  name="question"
                  className="input-field"
                  value={formData.question}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Example: Demonstrate your ability to work effectively in a team environment..."
                  required
                />
              </div>

              <div>
                <label className="input-label">Your Resume / Experience Details *</label>
                <textarea
                  name="resumeContext"
                  className="input-field"
                  value={formData.resumeContext}
                  onChange={handleChange}
                  rows="8"
                  placeholder="Paste your resume content or describe relevant experience, achievements, and skills that relate to the question..."
                  required
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Generating Response...</>
                ) : (
                  <>
                    <Target size={20} weight="fill" />
                    Generate STAR Response
                  </>
                )}
              </button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#EFF6FF', borderLeft: '4px solid #3B82F6' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1E40AF' }}>STAR Format Explained:</h3>
              <ul className="text-sm space-y-1" style={{ color: '#1E40AF' }}>
                <li><strong>S</strong>ituation - Set the context</li>
                <li><strong>T</strong>ask - Describe your responsibility</li>
                <li><strong>A</strong>ction - Explain what you did</li>
                <li><strong>R</strong>esult - Share the outcome/impact</li>
              </ul>
            </div>
          </div>

          {/* Generated Response */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-section">STAR Response</h2>
              {response && (
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

            {!response && !loading && (
              <div className="text-center py-12" style={{ color: '#708090' }}>
                <Target size={48} className="mx-auto mb-4" style={{ opacity: 0.3 }} />
                <p>Enter your question and resume details, then click generate</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#001F3F' }}></div>
                <p style={{ color: '#708090' }}>Crafting your STAR response...</p>
              </div>
            )}

            {response && !loading && (
              <div
                className="p-6 rounded-lg border prose max-w-none"
                style={{
                  borderColor: '#10B981',
                  backgroundColor: '#F0FDF4',
                  lineHeight: '1.8',
                  color: '#001F3F',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {response}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionCriteria;
