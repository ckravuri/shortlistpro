import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FileText, Plus, Trash, PencilSimple, SignOut, Sparkle, Camera, Target, Crown, CreditCard } from '@phosphor-icons/react';
import { ResumeUpload } from '../components/ResumeUpload';
import AdSenseAd from '../components/AdSenseAd';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('My Resume');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchResumes();
    fetchSubscriptionStatus();
    
    // Check for checkout success
    if (searchParams.get('checkout') === 'success') {
      setTimeout(() => {
        alert('🎉 Subscription activated! Welcome to PRO!');
        window.history.replaceState({}, '', '/dashboard');
      }, 500);
    }
  }, [searchParams]);

  const fetchResumes = async () => {
    try {
      const { data } = await axios.get(`${API}/resumes`, { withCredentials: true });
      setResumes(data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const { data } = await axios.get(`${API}/subscription-status`, { withCredentials: true });
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data } = await axios.post(`${API}/create-portal-session`, {}, { withCredentials: true });
      window.location.href = data.portal_url;
    } catch (error) {
      console.error('Portal error:', error);
      alert('Unable to open subscription management. Please try again.');
    }
  };

  const handleCreateResume = async () => {
    try {
      const { data } = await axios.post(
        `${API}/resumes`,
        { title: newResumeTitle, region: user?.region || 'US' },
        { withCredentials: true }
      );
      navigate(`/resume/${data.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await axios.delete(`${API}/resumes/${resumeId}`, { withCredentials: true });
      setResumes(resumes.filter((r) => r.id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getATSColor = (score) => {
    if (score >= 70) return '#50C878';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={32} weight="bold" style={{ color: '#001F3F' }} />
            <span className="text-2xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              ShortlistPro.cv
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="body-text-sm">
              <span style={{ color: '#708090' }}>Welcome, </span>
              <span style={{ color: '#001F3F', fontWeight: 500 }}>{user?.name}</span>
            </span>
            {subscriptionStatus && subscriptionStatus.tier !== 'free' && (
              <button
                onClick={handleManageSubscription}
                className="btn-secondary flex items-center gap-2"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                data-testid="manage-subscription-btn"
              >
                <CreditCard size={16} weight="bold" />
                Manage Subscription
              </button>
            )}
            {subscriptionStatus && subscriptionStatus.can_upgrade && (
              <button
                onClick={() => navigate('/pricing')}
                className="btn-primary flex items-center gap-2"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                data-testid="upgrade-btn"
              >
                <Crown size={16} weight="bold" />
                Upgrade
              </button>
            )}
            <button
              onClick={handleLogout}
              data-testid="logout-button"
              className="btn-secondary flex items-center gap-2"
              style={{ padding: '0.5rem 1rem' }}
            >
              <SignOut size={18} weight="bold" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Subscription Status Banner */}
        {subscriptionStatus && (
          <div className="mb-6 card flex items-center justify-between">
            <div className="flex items-center gap-3">
              {subscriptionStatus.tier === 'free' && (
                <>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
                    <FileText size={20} weight="bold" style={{ color: '#708090' }} />
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: '#001F3F' }}>Free Plan</h3>
                    <p className="body-text-sm">
                      {subscriptionStatus.usage.resumes}/{subscriptionStatus.limits.max_resumes} resumes • 
                      {' '}{subscriptionStatus.usage.ai_suggestions}/{subscriptionStatus.limits.max_ai_suggestions} AI suggestions this month
                    </p>
                  </div>
                </>
              )}
              {subscriptionStatus.tier === 'pro' && (
                <>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#50C878' }}>
                    <Sparkle size={20} weight="bold" style={{ color: '#FFFFFF' }} />
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: '#001F3F' }}>PRO Plan</h3>
                    <p className="body-text-sm">Unlimited resumes, AI, and exports • No ads</p>
                  </div>
                </>
              )}
              {subscriptionStatus.tier === 'pro+' && (
                <>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#001F3F' }}>
                    <Crown size={20} weight="bold" style={{ color: '#50C878' }} />
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: '#001F3F' }}>PRO+ Plan</h3>
                    <p className="body-text-sm">All features unlocked • Priority support</p>
                  </div>
                </>
              )}
            </div>
            {subscriptionStatus.can_upgrade && (
              <button
                onClick={() => navigate('/pricing')}
                className="btn-primary flex items-center gap-2"
                data-testid="banner-upgrade-btn"
              >
                <Crown size={18} weight="bold" />
                Upgrade Now
              </button>
            )}
          </div>
        )}

        {/* AdSense for Free Users */}
        {user?.subscription_tier === 'free' || !user?.subscription_tier ? (
          <div className="mb-8" data-testid="adsense-banner">
            <AdSenseAd format="horizontal" style={{ display: 'block', textAlign: 'center', minHeight: '90px' }} />
          </div>
        ) : null}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-section mb-2">My Resumes</h1>
            <p className="body-text">Create, edit, and manage your professional resumes</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            data-testid="create-resume-button"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} weight="bold" />
            New Resume
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/star-builder')}
            className="card text-left hover:shadow-lg transition-shadow"
            data-testid="star-builder-link"
          >
            <Target size={28} weight="bold" style={{ color: '#50C878', marginBottom: '0.5rem' }} />
            <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              STAR Builder
            </h3>
            <p className="body-text-sm">AU Govt selection criteria</p>
          </button>

          <button
            onClick={() => navigate('/headshot-generator')}
            className="card text-left hover:shadow-lg transition-shadow"
            data-testid="headshot-generator-link"
          >
            <Camera size={28} weight="bold" style={{ color: '#50C878', marginBottom: '0.5rem' }} />
            <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              AI Headshot
            </h3>
            <p className="body-text-sm">Professional photo generator</p>
          </button>

          <button
            onClick={() => navigate('/job-ad-generator')}
            className="card text-left hover:shadow-lg transition-shadow"
            data-testid="job-ad-generator-link"
          >
            <Sparkle size={28} weight="bold" style={{ color: '#50C878', marginBottom: '0.5rem' }} />
            <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Job Ad Generator
            </h3>
            <p className="body-text-sm">Tailored resume & cover letter</p>
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="card text-left hover:shadow-lg transition-shadow"
              data-testid="admin-dashboard-link"
            >
              <Crown size={28} weight="bold" style={{ color: '#50C878', marginBottom: '0.5rem' }} />
              <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                Admin Dashboard
              </h3>
              <p className="body-text-sm">Analytics & user management</p>
            </button>
          )}
        </div>

        {/* Resume Upload */}
        <div className="mb-8">
          <ResumeUpload />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="body-text">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="card text-center py-12" data-testid="empty-state">
            <FileText size={64} weight="thin" style={{ color: '#708090', margin: '0 auto 1rem' }} />
            <h3 className="text-xl font-medium mb-2" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              No resumes yet
            </h3>
            <p className="body-text mb-6">Create your first resume to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              data-testid="empty-state-create-button"
              className="btn-primary"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id || resume._id} className="card" data-testid={`resume-card-${resume.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                      {resume.title}
                    </h3>
                    <p className="body-text-sm" style={{ color: '#708090' }}>
                      {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center rounded-full border-2 font-bold text-sm"
                    style={{
                      borderColor: getATSColor(resume.ats_score || 0),
                      color: getATSColor(resume.ats_score || 0),
                      width: '3rem',
                      height: '3rem',
                    }}
                    data-testid={`ats-score-${resume.id}`}
                  >
                    {resume.ats_score || 0}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/resume/${resume.id}`)}
                    data-testid={`edit-resume-${resume.id}`}
                    className="btn-primary flex items-center gap-2 flex-1"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    <PencilSimple size={16} weight="bold" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteResume(resume.id)}
                    data-testid={`delete-resume-${resume.id}`}
                    className="btn-secondary flex items-center gap-2"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Resume Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0, 31, 63, 0.5)', zIndex: 50 }}
          data-testid="create-resume-modal"
        >
          <div className="card max-w-md w-full">
            <h2 className="heading-section mb-4">Create New Resume</h2>
            <div className="mb-6">
              <label htmlFor="resume-title" className="input-label">
                Resume Title
              </label>
              <input
                id="resume-title"
                type="text"
                data-testid="resume-title-input"
                className="input-field"
                value={newResumeTitle}
                onChange={(e) => setNewResumeTitle(e.target.value)}
                placeholder="e.g., Software Engineer Resume"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateResume}
                data-testid="modal-create-button"
                className="btn-primary flex-1"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                data-testid="modal-cancel-button"
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
