import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Sparkle, Copy, Check } from '@phosphor-icons/react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const BulletPointWriter = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    experience: '',
    role: '',
    context: ''
  });
  
  const [bulletPoints, setBulletPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.experience) {
      setError('Please describe your experience');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post(
        `${API}/generate-bullet-points`,
        formData,
        { withCredentials: true }
      );
      
      setBulletPoints(data.bullet_points || []);
    } catch (err) {
      console.error('Bullet point generation error:', err);
      setError(err.response?.data?.detail || 'Failed to generate bullet points');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
          <h1 className="heading-page mb-2">AI Bullet Point Writer</h1>
          <p className="body-text-sm mb-3" style={{ color: '#708090' }}>
            Transform your experience into powerful, quantified bullet points
          </p>
          {/* No-Fabrication Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F59E0B" strokeWidth="2"/>
              <path d="M12 8V12L14 14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium" style={{ color: '#92400E' }}>
              No-Fabrication AI: Only uses information you provide
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="heading-section mb-6">Your Experience</h2>
            
            {error && (
              <div className="mb-4 p-3 border-l-4 rounded-sm" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#991B1B' }}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="input-label">Role/Position (Optional)</label>
                <input
                  type="text"
                  name="role"
                  className="input-field"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Senior Software Engineer"
                />
              </div>

              <div>
                <label className="input-label">Describe Your Experience *</label>
                <textarea
                  name="experience"
                  className="input-field"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Example: Led development of new feature that improved user engagement"
                  required
                />
              </div>

              <div>
                <label className="input-label">Additional Context (Optional)</label>
                <textarea
                  name="context"
                  className="input-field"
                  value={formData.context}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Team size, technologies used, metrics, achievements..."
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
                    Generate Bullet Points
                  </>
                )}
              </button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F0F9FF', borderLeft: '4px solid #3B82F6' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1E40AF' }}>Tips for Better Results:</h3>
              <ul className="text-sm space-y-1" style={{ color: '#1E40AF' }}>
                <li>• Include specific numbers and metrics</li>
                <li>• Mention technologies or tools used</li>
                <li>• Describe the impact of your work</li>
                <li>• Add team size or project scope</li>
              </ul>
            </div>
          </div>

          {/* Generated Bullet Points */}
          <div className="card">
            <h2 className="heading-section mb-6">Professional Bullet Points</h2>

            {!bulletPoints.length && !loading && (
              <div className="text-center py-16" style={{ 
                background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.02) 0%, rgba(80, 200, 120, 0.02) 100%)',
                borderRadius: '0.5rem'
              }}>
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full" style={{ 
                    background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.05) 0%, rgba(80, 200, 120, 0.05) 100%)',
                  }}></div>
                  <div className="absolute inset-3 flex items-center justify-center">
                    <Sparkle size={48} weight="duotone" style={{ color: '#50C878' }} />
                  </div>
                </div>
                <p className="text-lg font-medium mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                  Ready to transform your experience
                </p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Describe your achievements and let AI craft powerful bullet points
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-16">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                    style={{ 
                      borderTopColor: '#50C878',
                      borderRightColor: '#50C878',
                      animationDuration: '1s'
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkle size={24} weight="fill" style={{ color: '#50C878' }} />
                  </div>
                </div>
                <p className="font-medium" style={{ color: '#001F3F' }}>Crafting powerful bullet points...</p>
                <p className="text-sm mt-2" style={{ color: '#64748B' }}>This may take a few moments</p>
              </div>
            )}

            {bulletPoints.length > 0 && !loading && (
              <div className="space-y-4">
                {bulletPoints.map((bullet, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border group hover:shadow-md transition-all"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p style={{ color: '#001F3F', lineHeight: '1.6' }}>
                          {bullet}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bullet, index)}
                        className="btn-secondary p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check size={18} style={{ color: '#10B981' }} />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletPointWriter;