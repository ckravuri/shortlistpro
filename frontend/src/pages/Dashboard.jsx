import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FileText, Plus, Trash, PencilSimple, Sparkle, Camera, Target, Crown, CreditCard, ListBullets, TextAlignLeft, Stack, Warning } from '@phosphor-icons/react';
import { ResumeUpload } from '../components/ResumeUpload';
import AdSenseAd from '../components/AdSenseAd';
import Navbar from '../components/Navbar';
import UpgradeModal from '../components/UpgradeModal';
import DeleteAccountModal from '../components/DeleteAccountModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('My Resume');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState({ currentCount: 0, limit: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      
      // Check if it's a subscription limit error
      if (error.response?.status === 403 && error.response?.data?.detail?.upgrade_required) {
        const detail = error.response.data.detail;
        setUpgradeInfo({
          currentCount: detail.current_count,
          limit: detail.limit
        });
        setShowUpgradeModal(true);
      } else {
        alert('Error creating resume. Please try again.');
      }
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    // Optimistically remove from UI first
    const originalResumes = [...resumes];
    setResumes(resumes.filter((r) => r.id !== resumeId));
    
    try {
      const response = await fetch(`${API}/resumes/${resumeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        // Restore on error
        setResumes(originalResumes);
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
      setResumes(originalResumes); // Restore on error
    }
  };

  const getATSColor = (score) => {
    if (score >= 70) return '#50C878';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${API}/user/account`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Logout and redirect to landing page
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error; // Let modal handle the error
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Navigation */}
      <Navbar />

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
            <div className="flex items-center gap-2">
              {subscriptionStatus.tier !== 'free' && (
                <button
                  onClick={handleManageSubscription}
                  className="btn-secondary flex items-center gap-2"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  data-testid="manage-subscription-btn"
                >
                  <CreditCard size={16} weight="bold" />
                  Manage
                </button>
              )}
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
            onClick={() => navigate('/selection-criteria')}
            className="card text-left hover:shadow-lg transition-shadow"
            data-testid="selection-criteria-link"
          >
            <Target size={28} weight="bold" style={{ color: '#EC4899', marginBottom: '0.5rem' }} />
            <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Selection Criteria
            </h3>
            <p className="body-text-sm">STAR-format responses</p>
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
            onClick={() => navigate('/bullet-writer')}
            className="card text-left hover:shadow-lg transition-shadow"
            data-testid="bullet-writer-link"
          >
            <ListBullets size={28} weight="bold" style={{ color: '#8B5CF6', marginBottom: '0.5rem' }} />
            <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Bullet Point Writer
            </h3>
            <p className="body-text-sm">Powerful resume bullets</p>
          </button>

          <button
            onClick={() => navigate('/summary-generator')}
            className="card text-left hover:shadow-lg transition-shadow"
            data-testid="summary-generator-link"
          >
            <Sparkle size={28} weight="bold" style={{ color: '#F59E0B', marginBottom: '0.5rem' }} />
            <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Summary Generator
            </h3>
            <p className="body-text-sm">Professional summaries</p>
          </button>

          <button
            onClick={() => navigate('/cover-letter')}
            className="card text-left hover:shadow-lg transition-shadow"
            data-testid="cover-letter-link"
          >
            <TextAlignLeft size={28} weight="bold" style={{ color: '#3B82F6', marginBottom: '0.5rem' }} />
            <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Cover Letter
            </h3>
            <p className="body-text-sm">Tailored cover letters</p>
          </button>

          <button
            onClick={() => navigate('/templates')}
            className="card text-left hover:shadow-lg transition-shadow"
            data-testid="templates-link"
          >
            <Stack size={28} weight="bold" style={{ color: '#10B981', marginBottom: '0.5rem' }} />
            <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Templates
            </h3>
            <p className="body-text-sm">Pre-made resume templates</p>
          </button>

          <button
            onClick={() => navigate('/job-ad-generator')}
            className="card text-left hover:shadow-lg transition-shadow"
            data-testid="job-ad-generator-link"
          >
            <Sparkle size={28} weight="bold" style={{ color: '#14B8A6', marginBottom: '0.5rem' }} />
            <h3 className="text-base font-medium mb-1" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Tailor Resume to Job Ad
            </h3>
            <p className="body-text-sm">Customize for any job posting</p>
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
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-lg font-medium mb-1 truncate" 
                      style={{ fontFamily: 'Outfit', color: '#001F3F' }}
                      title={resume.title}
                    >
                      {resume.title}
                    </h3>
                    <p className="body-text-sm" style={{ color: '#708090' }}>
                      {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center rounded-full border-2 font-bold text-sm flex-shrink-0"
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

      {/* Account Settings - Danger Zone */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div 
          className="card border-2"
          style={{ borderColor: '#FCA5A5' }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Warning size={32} weight="fill" style={{ color: '#DC2626' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Outfit', color: '#991B1B' }}>
                Danger Zone
              </h3>
              <p className="body-text mb-4" style={{ color: '#7F1D1D' }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontFamily: 'Outfit'
                }}
              >
                <Trash size={20} weight="bold" />
                Delete My Account
              </button>
            </div>
          </div>
        </div>
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

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        message="You've reached your Free plan limit"
        currentCount={upgradeInfo.currentCount}
        limit={upgradeInfo.limit}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default Dashboard;
