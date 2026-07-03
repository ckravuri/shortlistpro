import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowLeft, Sparkle } from '@phosphor-icons/react';
import UpgradeModal from '../components/UpgradeModal';

const API = process.env.REACT_APP_BACKEND_URL;

export const InterviewPrep = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
    fetchResumes();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/user`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        
        // Check if user has Pro+ access
        if (data.subscription_tier.toLowerCase() !== 'pro+') {
          setShowUpgradeModal(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch(`${API}/api/resumes`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes);
        if (data.resumes.length > 0) {
          setSelectedResumeId(data.resumes[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      setError('Please select a resume and paste the job description');
      return;
    }

    setLoading(true);
    setError('');
    setQuestions(null);

    try {
      const res = await fetch(`${API}/api/interview-prep/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          resume_id: selectedResumeId,
          job_description: jobDescription
        })
      });

      if (res.status === 403) {
        setShowUpgradeModal(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to generate questions');
      }

      const data = await res.json();
      setQuestions(data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestions = (category, questionsList) => {
    const categoryIcons = {
      technical: '💻',
      behavioral: '🤝',
      situational: '🎯'
    };

    const categoryTitles = {
      technical: 'Technical Questions',
      behavioral: 'Behavioral Questions',
      situational: 'Situational Questions'
    };

    return (
      <div key={category} className="card mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
          <span>{categoryIcons[category]}</span>
          {categoryTitles[category]}
        </h3>
        <ol className="space-y-3">
          {questionsList.map((question, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="font-semibold" style={{ color: '#50C878', minWidth: '1.5rem' }}>
                {idx + 1}.
              </span>
              <p className="body-text" style={{ color: '#001F3F' }}>
                {question}
              </p>
            </li>
          ))}
        </ol>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 body-text hover:opacity-70 transition-opacity"
            style={{ color: '#001F3F' }}
          >
            <ArrowLeft size={20} weight="bold" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-sm text-sm font-medium" style={{ backgroundColor: '#50C878', color: '#001F3F' }}>
              Pro+ Feature
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center"
              style={{ backgroundColor: '#50C878' }}
            >
              <Lightbulb size={28} weight="bold" style={{ color: '#001F3F' }} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Interview Preparation
            </h1>
          </div>
          <p className="body-text text-lg">
            Prepare for your interview with AI-generated questions tailored to your resume and the specific job role.
          </p>
        </div>

        {/* Input Form */}
        <div className="card mb-8">
          <div className="space-y-6">
            {/* Resume Selection */}
            <div>
              <label className="input-label">SELECT YOUR RESUME</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="input-field"
                disabled={loading}
              >
                {resumes.length === 0 ? (
                  <option>No resumes found</option>
                ) : (
                  resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title}
                    </option>
                  ))
                )}
              </select>
              {resumes.length === 0 && (
                <p className="text-sm mt-2" style={{ color: '#EF4444' }}>
                  Please create a resume first before using interview prep.
                </p>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label className="input-label">PASTE JOB DESCRIPTION</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here including responsibilities, requirements, and qualifications..."
                className="input-field"
                rows={12}
                disabled={loading}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-sm" style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444' }}>
                <p className="text-sm font-medium" style={{ color: '#B91C1C' }}>
                  {error}
                </p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || resumes.length === 0}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              style={{ padding: '0.875rem 2rem' }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: '#001F3F' }}></div>
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkle size={20} weight="bold" />
                  Generate Interview Questions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {questions && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-12 rounded-sm" style={{ backgroundColor: '#50C878' }}></div>
              <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                Your Tailored Interview Questions
              </h2>
            </div>

            {questions.technical && questions.technical.length > 0 && renderQuestions('technical', questions.technical)}
            {questions.behavioral && questions.behavioral.length > 0 && renderQuestions('behavioral', questions.behavioral)}
            {questions.situational && questions.situational.length > 0 && renderQuestions('situational', questions.situational)}

            {/* Tips Section */}
            <div className="card" style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}>
              <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ fontFamily: 'Outfit', color: '#92400E' }}>
                <Lightbulb size={20} weight="fill" style={{ color: '#F59E0B' }} />
                Interview Preparation Tips
              </h4>
              <ul className="space-y-2 body-text-sm" style={{ color: '#78350F' }}>
                <li>• Practice answering each question out loud</li>
                <li>• Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
                <li>• Prepare specific examples from your experience for each question</li>
                <li>• Research the company and role before your interview</li>
                <li>• Prepare thoughtful questions to ask the interviewer</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => {
            setShowUpgradeModal(false);
            navigate('/dashboard');
          }}
          requiredTier="pro+"
          feature="Interview Preparation"
        />
      )}
    </div>
  );
};

export default InterviewPrep;
