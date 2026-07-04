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
  const [answers, setAnswers] = useState({}); // Store answers by question index
  const [loadingAnswers, setLoadingAnswers] = useState({}); // Track loading state per question
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
    fetchResumes();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
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
        setResumes(data);
        if (data.length > 0) {
          setSelectedResumeId(data[0].id);
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
      setAnswers({}); // Reset answers when new questions are generated
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAnswer = async (question, category, index) => {
    const answerKey = `${category}-${index}`;
    
    // Set loading state for this specific question
    setLoadingAnswers(prev => ({ ...prev, [answerKey]: true }));
    
    try {
      // Get resume context
      const resume = resumes.find(r => r.id === selectedResumeId);
      const resumeContext = resume ? `
Professional Summary: ${resume.personal_info?.summary || 'Not provided'}
Key Skills: ${resume.skills?.slice(0, 5).join(', ') || 'Not provided'}
Recent Experience: ${resume.work_experience?.[0]?.position || ''} at ${resume.work_experience?.[0]?.company || ''}
      `.trim() : 'Resume information not available';

      const res = await fetch(`${API}/api/interview-prep/generate-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          question,
          job_description: jobDescription,
          resume_context: resumeContext
        })
      });

      if (res.status === 403) {
        setShowUpgradeModal(true);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to generate answer');
      }

      const data = await res.json();
      setAnswers(prev => ({ ...prev, [answerKey]: data.answer }));
    } catch (err) {
      console.error('Failed to generate answer:', err);
      setAnswers(prev => ({ ...prev, [answerKey]: 'Failed to generate answer. Please try again.' }));
    } finally {
      setLoadingAnswers(prev => ({ ...prev, [answerKey]: false }));
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
        <ol className="space-y-4">
          {questionsList.map((question, idx) => {
            const answerKey = `${category}-${idx}`;
            const hasAnswer = answers[answerKey];
            const isLoadingAnswer = loadingAnswers[answerKey];

            return (
              <li key={idx} className="border-b pb-4 last:border-b-0" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex gap-3 mb-2">
                  <span className="font-semibold" style={{ color: '#50C878', minWidth: '1.5rem' }}>
                    {idx + 1}.
                  </span>
                  <p className="body-text flex-1" style={{ color: '#001F3F' }}>
                    {question}
                  </p>
                </div>
                
                {/* Generate Answer Button */}
                <div className="ml-8">
                  {!hasAnswer && (
                    <button
                      onClick={() => generateAnswer(question, category, idx)}
                      disabled={isLoadingAnswer}
                      className="text-sm font-medium px-3 py-1.5 rounded-sm flex items-center gap-2 transition-all"
                      style={{ 
                        backgroundColor: isLoadingAnswer ? '#E2E8F0' : '#F0FDF4',
                        color: isLoadingAnswer ? '#64748B' : '#166534',
                        border: `1px solid ${isLoadingAnswer ? '#CBD5E1' : '#BBF7D0'}`,
                        cursor: isLoadingAnswer ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isLoadingAnswer ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2" style={{ borderColor: '#64748B' }}></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkle size={14} weight="fill" style={{ color: '#16A34A' }} />
                          Generate Sample Answer
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Display Answer */}
                  {hasAnswer && (
                    <div 
                      className="mt-3 p-4 rounded-lg"
                      style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}
                    >
                      <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: '#166534' }}>
                        <Sparkle size={12} weight="fill" />
                        Sample Answer (STAR Method)
                      </p>
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#14532D' }}>
                        {hasAnswer}
                      </p>
                      <p className="text-xs mt-3 italic" style={{ color: '#15803D' }}>
                        💡 Tip: Customize this answer with your own specific examples and experiences
                      </p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
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
