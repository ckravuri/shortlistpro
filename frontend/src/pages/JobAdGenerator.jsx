import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ArrowLeft, Sparkle, FileText } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const JobAdGenerator = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await axios.get(`${API}/resumes`, { withCredentials: true });
      setResumes(data);
      if (data.length > 0) {
        setSelectedResumeId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const generateContent = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      alert('Please select a resume and paste a job description');
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch(`${API}/generate-from-job-ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          job_description: jobDescription,
          resume_id: selectedResumeId
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.substring(6));
              if (jsonData.content) {
                accumulated += jsonData.content;
                setResult(accumulated);
              }
              if (jsonData.done) {
                setGenerating(false);
                // Try to parse the accumulated JSON
                try {
                  const parsed = JSON.parse(jsonData.full_content || accumulated);
                  setResult(parsed);
                } catch {
                  // If not valid JSON, keep as text
                }
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={18} weight="bold" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Sparkle size={32} weight="bold" style={{ color: '#50C878' }} />
          <h1 className="heading-section">Job Ad Resume Generator</h1>
        </div>
        <p className="body-text mb-8">
          Paste a job description and we'll generate a tailored professional summary and cover letter based on your resume.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="card">
              <label className="input-label">Select Your Resume</label>
              <select
                className="input-field"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                data-testid="select-resume"
              >
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="card">
              <label className="input-label">Job Description</label>
              <textarea
                className="input-field"
                rows={15}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                data-testid="job-description-input"
              />
            </div>

            <button
              onClick={generateContent}
              disabled={generating || !selectedResumeId || !jobDescription.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2"
              data-testid="generate-content-btn"
            >
              <Sparkle size={18} weight="bold" />
              {generating ? 'Generating...' : 'Generate Tailored Content'}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                Generated Content
              </h3>
              {result ? (
                typeof result === 'object' ? (
                  <div>
                    <div className="mb-6">
                      <strong className="input-label">Tailored Professional Summary:</strong>
                      <p className="body-text mt-2">{result.summary}</p>
                    </div>
                    <div>
                      <strong className="input-label">Cover Letter:</strong>
                      <div className="body-text mt-2 whitespace-pre-wrap">{result.cover_letter}</div>
                    </div>
                  </div>
                ) : (
                  <div className="body-text whitespace-pre-wrap">{result}</div>
                )
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} weight="thin" style={{ color: '#708090', margin: '0 auto 1rem' }} />
                  <p className="body-text">Your generated content will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAdGenerator;
