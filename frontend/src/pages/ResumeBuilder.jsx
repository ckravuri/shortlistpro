import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  FileText,
  ArrowLeft,
  Plus,
  Trash,
  Sparkle,
  Check,
  X,
  DownloadSimple,
  Article,
  ListBullets,
} from '@phosphor-icons/react';
import { ScoreHistory } from '../components/ScoreHistory';
import { DocumentView } from '../components/DocumentView';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiContext, setAiContext] = useState({ field: '', context: '', current_text: '' });
  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [viewMode, setViewMode] = useState('document'); // 'document' or 'form'

  useEffect(() => {
    fetchResume();
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`${API}/resumes/${resumeId}`, { withCredentials: true });
      console.log('Fetched resume data:', data); // Debug log
      setResume(data);
      setAtsScore(data.ats_score || 0);
      
      // If resume has content (especially from upload/template), default to form view for editing
      const hasContent = data.personal_info?.full_name || 
                        data.work_experience?.length > 0 || 
                        data.education?.length > 0 ||
                        data.skills?.length > 0;
      if (hasContent) {
        setViewMode('form');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async (updatedData) => {
    setSaving(true);
    try {
      const { data } = await axios.put(`${API}/resumes/${resumeId}`, updatedData, {
        withCredentials: true,
      });
      setResume(data);
      setAtsScore(data.ats_score || 0);
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    const updatedPersonalInfo = { ...resume.personal_info, [field]: value };
    const updatedResume = { ...resume, personal_info: updatedPersonalInfo };
    setResume(updatedResume);
  };

  const handlePersonalInfoBlur = () => {
    saveResume({ personal_info: resume.personal_info });
  };

  const addWorkExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: '',
      achievements: [],
    };
    const updatedWorkExp = [...(resume.work_experience || []), newExp];
    const updatedResume = { ...resume, work_experience: updatedWorkExp };
    setResume(updatedResume);
    saveResume({ work_experience: updatedWorkExp });
  };

  const updateWorkExperience = (index, field, value) => {
    const updatedWorkExp = [...resume.work_experience];
    updatedWorkExp[index] = { ...updatedWorkExp[index], [field]: value };
    setResume({ ...resume, work_experience: updatedWorkExp });
  };

  const saveWorkExperience = () => {
    saveResume({ work_experience: resume.work_experience });
  };

  const deleteWorkExperience = (index) => {
    const updatedWorkExp = resume.work_experience.filter((_, i) => i !== index);
    setResume({ ...resume, work_experience: updatedWorkExp });
    saveResume({ work_experience: updatedWorkExp });
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      start_date: '',
      end_date: '',
      gpa: '',
    };
    const updatedEducation = [...(resume.education || []), newEdu];
    const updatedResume = { ...resume, education: updatedEducation };
    setResume(updatedResume);
    saveResume({ education: updatedEducation });
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...resume.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setResume({ ...resume, education: updatedEducation });
  };

  const saveEducation = () => {
    saveResume({ education: resume.education });
  };

  const deleteEducation = (index) => {
    const updatedEducation = resume.education.filter((_, i) => i !== index);
    setResume({ ...resume, education: updatedEducation });
    saveResume({ education: updatedEducation });
  };

  const addSkill = () => {
    if (newSkill && newSkill.trim()) {
      const updatedSkills = [...(resume.skills || []), newSkill.trim()];
      setResume({ ...resume, skills: updatedSkills });
      saveResume({ skills: updatedSkills });
      setNewSkill('');
      setShowSkillInput(false);
    }
  };

  const deleteSkill = (index) => {
    const updatedSkills = resume.skills.filter((_, i) => i !== index);
    setResume({ ...resume, skills: updatedSkills });
    saveResume({ skills: updatedSkills });
  };

  const requestAISuggestion = async (field, context, currentText) => {
    setAiContext({ field, context, current_text: currentText });
    setAiSuggestion('');
    setShowAiModal(true);
    setAiLoading(true);

    try {
      const response = await fetch(`${API}/resumes/${resumeId}/ai-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ field, context, current_text: currentText }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

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
                accumulatedText += jsonData.content;
                setAiSuggestion(accumulatedText);
              }
              if (jsonData.done) {
                setAiLoading(false);
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      setAiSuggestion('Error getting suggestion. Please try again.');
      setAiLoading(false);
    }
  };

  const applyAISuggestion = () => {
    // Apply the suggestion to the appropriate field
    if (aiContext.field === 'summary') {
      handlePersonalInfoChange('summary', aiSuggestion);
      handlePersonalInfoBlur();
    }
    setShowAiModal(false);
  };

  const getATSColor = (score) => {
    if (score >= 70) return '#50C878';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getATSClass = (score) => {
    if (score >= 70) return 'ats-excellent';
    if (score >= 40) return 'ats-warning';
    return 'ats-poor';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <p className="body-text">Loading resume...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <p className="body-text">Resume not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              data-testid="back-to-dashboard"
              className="btn-secondary flex items-center gap-2"
              style={{ padding: '0.5rem 1rem' }}
            >
              <ArrowLeft size={18} weight="bold" />
              Dashboard
            </button>
            <div className="flex items-center gap-2">
              <FileText size={28} weight="bold" style={{ color: '#001F3F' }} />
              <span className="text-xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                {resume.title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {saving && <span className="body-text-sm" style={{ color: '#708090' }}>Saving...</span>}
            
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
              <button
                onClick={() => setViewMode('document')}
                className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                  viewMode === 'document' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={viewMode === 'document' ? { backgroundColor: '#50C878', color: '#FFFFFF' } : {}}
                data-testid="document-view-toggle"
              >
                <Article size={18} weight="bold" />
                <span className="text-sm font-medium">Document View</span>
              </button>
              <button
                onClick={() => setViewMode('form')}
                className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                  viewMode === 'form' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={viewMode === 'form' ? { backgroundColor: '#50C878', color: '#FFFFFF' } : {}}
                data-testid="form-view-toggle"
              >
                <ListBullets size={18} weight="bold" />
                <span className="text-sm font-medium">Form View</span>
              </button>
            </div>
            
            {/* ATS Score */}
            <div className="flex items-center gap-2">
              <span className="body-text-sm" style={{ color: '#708090' }}>ATS Score:</span>
              <span
                className="px-3 py-1 rounded-full font-semibold"
                style={{
                  backgroundColor: `${getATSColor(atsScore)}15`,
                  color: getATSColor(atsScore)
                }}
                data-testid="ats-score"
              >
                {atsScore}/100
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'document' ? (
          /* Document View - MS Word Style */
          <DocumentView 
            resume={resume} 
            resumeId={resumeId}
            onEdit={(section) => setViewMode('form')}
          />
        ) : (
          /* Form View - Original Layout */
          <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="card" data-testid="personal-info-section">
              <h2 className="heading-section mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    data-testid="input-full-name"
                    className="input-field"
                    value={resume.personal_info?.full_name || ''}
                    onChange={(e) => handlePersonalInfoChange('full_name', e.target.value)}
                    onBlur={handlePersonalInfoBlur}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    data-testid="input-email"
                    className="input-field"
                    value={resume.personal_info?.email || ''}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    onBlur={handlePersonalInfoBlur}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="input-label">Phone</label>
                  <input
                    type="tel"
                    data-testid="input-phone"
                    className="input-field"
                    value={resume.personal_info?.phone || ''}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    onBlur={handlePersonalInfoBlur}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="input-label">Location</label>
                  <input
                    type="text"
                    data-testid="input-location"
                    className="input-field"
                    value={resume.personal_info?.location || ''}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    onBlur={handlePersonalInfoBlur}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="input-label">LinkedIn</label>
                  <input
                    type="url"
                    data-testid="input-linkedin"
                    className="input-field"
                    value={resume.personal_info?.linkedin || ''}
                    onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                    onBlur={handlePersonalInfoBlur}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="input-label">Website</label>
                  <input
                    type="url"
                    data-testid="input-website"
                    className="input-field"
                    value={resume.personal_info?.website || ''}
                    onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                    onBlur={handlePersonalInfoBlur}
                    placeholder="johndoe.com"
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="input-label">Professional Summary</label>
                  <button
                    onClick={() =>
                      requestAISuggestion(
                        'summary',
                        'Professional summary for resume',
                        resume.personal_info?.summary || ''
                      )
                    }
                    data-testid="ai-suggest-summary"
                    className="btn-secondary flex items-center gap-1"
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    <Sparkle size={14} weight="bold" />
                    AI Suggest
                  </button>
                </div>
                <textarea
                  data-testid="input-summary"
                  className="input-field"
                  rows={4}
                  value={resume.personal_info?.summary || ''}
                  onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                  onBlur={handlePersonalInfoBlur}
                  placeholder="Brief professional summary highlighting your key strengths and career goals..."
                />
              </div>
            </div>

            {/* Work Experience */}
            <div className="card" data-testid="work-experience-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-section">Work Experience</h2>
                <button
                  onClick={addWorkExperience}
                  data-testid="add-work-experience"
                  className="btn-primary flex items-center gap-2"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Plus size={16} weight="bold" />
                  Add
                </button>
              </div>
              {resume.work_experience?.length === 0 && (
                <p className="body-text-sm text-center py-4" style={{ color: '#708090' }}>
                  No work experience added yet
                </p>
              )}
              {resume.work_experience?.map((exp, index) => (
                <div
                  key={exp.id}
                  className="border rounded-sm p-4 mb-4"
                  style={{ borderColor: '#E2E8F0' }}
                  data-testid={`work-exp-${index}`}
                >
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => deleteWorkExperience(index)}
                      data-testid={`delete-work-exp-${index}`}
                      className="text-sm"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Company</label>
                      <input
                        type="text"
                        data-testid={`work-company-${index}`}
                        className="input-field"
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                        onBlur={saveWorkExperience}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="input-label">Position</label>
                      <input
                        type="text"
                        data-testid={`work-position-${index}`}
                        className="input-field"
                        value={exp.position}
                        onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                        onBlur={saveWorkExperience}
                        placeholder="Job Title"
                      />
                    </div>
                    <div>
                      <label className="input-label">Location</label>
                      <input
                        type="text"
                        data-testid={`work-location-${index}`}
                        className="input-field"
                        value={exp.location}
                        onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                        onBlur={saveWorkExperience}
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <label className="input-label">Dates</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          data-testid={`work-start-date-${index}`}
                          className="input-field"
                          value={exp.start_date}
                          onChange={(e) => updateWorkExperience(index, 'start_date', e.target.value)}
                          onBlur={saveWorkExperience}
                          placeholder="Jan 2020"
                        />
                        <input
                          type="text"
                          data-testid={`work-end-date-${index}`}
                          className="input-field"
                          value={exp.end_date}
                          onChange={(e) => updateWorkExperience(index, 'end_date', e.target.value)}
                          onBlur={saveWorkExperience}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="input-label">Description</label>
                    <textarea
                      data-testid={`work-description-${index}`}
                      className="input-field"
                      rows={3}
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                      onBlur={saveWorkExperience}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="card" data-testid="education-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-section">Education</h2>
                <button
                  onClick={addEducation}
                  data-testid="add-education"
                  className="btn-primary flex items-center gap-2"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Plus size={16} weight="bold" />
                  Add
                </button>
              </div>
              {resume.education?.length === 0 && (
                <p className="body-text-sm text-center py-4" style={{ color: '#708090' }}>
                  No education added yet
                </p>
              )}
              {resume.education?.map((edu, index) => (
                <div
                  key={edu.id}
                  className="border rounded-sm p-4 mb-4"
                  style={{ borderColor: '#E2E8F0' }}
                  data-testid={`education-${index}`}
                >
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => deleteEducation(index)}
                      data-testid={`delete-education-${index}`}
                      className="text-sm"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Institution</label>
                      <input
                        type="text"
                        data-testid={`edu-institution-${index}`}
                        className="input-field"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        onBlur={saveEducation}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <label className="input-label">Degree</label>
                      <input
                        type="text"
                        data-testid={`edu-degree-${index}`}
                        className="input-field"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        onBlur={saveEducation}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="input-label">Field of Study</label>
                      <input
                        type="text"
                        data-testid={`edu-field-${index}`}
                        className="input-field"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        onBlur={saveEducation}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <label className="input-label">Dates</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          data-testid={`edu-start-date-${index}`}
                          className="input-field"
                          value={edu.start_date}
                          onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                          onBlur={saveEducation}
                          placeholder="2016"
                        />
                        <input
                          type="text"
                          data-testid={`edu-end-date-${index}`}
                          className="input-field"
                          value={edu.end_date}
                          onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                          onBlur={saveEducation}
                          placeholder="2020"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="card" data-testid="skills-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-section">Skills</h2>
                <button
                  onClick={() => setShowSkillInput(true)}
                  data-testid="add-skill"
                  className="btn-primary flex items-center gap-2"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Plus size={16} weight="bold" />
                  Add Skill
                </button>
              </div>

              {/* Add Skill Input */}
              {showSkillInput && (
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="e.g., Python, Project Management, Communication"
                    className="input-field flex-1"
                    autoFocus
                  />
                  <button
                    onClick={addSkill}
                    className="btn-primary px-4"
                    disabled={!newSkill.trim()}
                  >
                    <Check size={18} weight="bold" />
                  </button>
                  <button
                    onClick={() => {
                      setShowSkillInput(false);
                      setNewSkill('');
                    }}
                    className="btn-secondary px-4"
                  >
                    <X size={18} weight="bold" />
                  </button>
                </div>
              )}

              {resume.skills?.length === 0 && !showSkillInput && (
                <p className="body-text-sm text-center py-4" style={{ color: '#708090' }}>
                  No skills added yet. Click &quot;Add Skill&quot; to get started.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {resume.skills?.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border rounded-sm px-3 py-2"
                    style={{ borderColor: '#50C878', backgroundColor: '#F0FDF4' }}
                    data-testid={`skill-${index}`}
                  >
                    <span className="body-text-sm font-medium" style={{ color: '#166534' }}>{skill}</span>
                    <button
                      onClick={() => deleteSkill(index)}
                      data-testid={`delete-skill-${index}`}
                      className="hover:opacity-70"
                      style={{ color: '#DC2626' }}
                    >
                      <X size={16} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - LIVE PREVIEW */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Preview Card */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="heading-section">Resume Preview</h2>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#F0FDF4', color: '#166534' }}>
                    Live
                  </span>
                </div>

                {/* Preview Content */}
                <div 
                  className="border-2 rounded-lg p-6 min-h-[600px]"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    fontSize: '11px',
                    lineHeight: '1.4'
                  }}
                >
                  {/* Personal Info */}
                  {resume?.personal_info && (
                    <div className="mb-4 text-center">
                      <h1 className="text-2xl font-bold mb-1" style={{ color: '#001F3F' }}>
                        {resume.personal_info.full_name || 'Your Name'}
                      </h1>
                      <div className="flex justify-center flex-wrap gap-2 text-xs" style={{ color: '#708090' }}>
                        {resume.personal_info.email && <span>{resume.personal_info.email}</span>}
                        {resume.personal_info.phone && <span>•</span>}
                        {resume.personal_info.phone && <span>{resume.personal_info.phone}</span>}
                        {resume.personal_info.location && <span>•</span>}
                        {resume.personal_info.location && <span>{resume.personal_info.location}</span>}
                      </div>
                      {resume.personal_info.linkedin && (
                        <div className="text-xs mt-1" style={{ color: '#3B82F6' }}>
                          {resume.personal_info.linkedin}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Professional Summary */}
                  {resume?.personal_info?.summary && (
                    <div className="mb-4">
                      <div className="font-bold mb-1 pb-1 border-b-2" style={{ color: '#001F3F', borderColor: '#50C878' }}>
                        PROFESSIONAL SUMMARY
                      </div>
                      <p className="text-xs" style={{ color: '#001F3F' }}>
                        {resume.personal_info.summary}
                      </p>
                    </div>
                  )}

                  {/* Work Experience */}
                  {resume?.work_experience && resume.work_experience.length > 0 && (
                    <div className="mb-4">
                      <div className="font-bold mb-2 pb-1 border-b-2" style={{ color: '#001F3F', borderColor: '#50C878' }}>
                        WORK EXPERIENCE
                      </div>
                      {resume.work_experience.map((exp, idx) => (
                        <div key={idx} className="mb-3">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <div className="font-bold text-xs" style={{ color: '#001F3F' }}>
                                {exp.position || 'Position'} {exp.company && `• ${exp.company}`}
                              </div>
                              {exp.location && (
                                <div className="text-xs" style={{ color: '#708090' }}>{exp.location}</div>
                              )}
                            </div>
                            <div className="text-xs whitespace-nowrap" style={{ color: '#708090' }}>
                              {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                            </div>
                          </div>
                          {exp.description && (
                            <p className="text-xs mb-1" style={{ color: '#001F3F' }}>{exp.description}</p>
                          )}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="list-disc list-inside text-xs space-y-1" style={{ color: '#001F3F' }}>
                              {exp.achievements.map((achievement, i) => (
                                <li key={i}>{achievement}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {resume?.education && resume.education.length > 0 && (
                    <div className="mb-4">
                      <div className="font-bold mb-2 pb-1 border-b-2" style={{ color: '#001F3F', borderColor: '#50C878' }}>
                        EDUCATION
                      </div>
                      {resume.education.map((edu, idx) => (
                        <div key={idx} className="mb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-xs" style={{ color: '#001F3F' }}>
                                {edu.degree} {edu.field && `in ${edu.field}`}
                              </div>
                              <div className="text-xs" style={{ color: '#708090' }}>
                                {edu.institution}
                              </div>
                            </div>
                            <div className="text-xs whitespace-nowrap" style={{ color: '#708090' }}>
                              {edu.start_date} - {edu.end_date}
                            </div>
                          </div>
                          {edu.gpa && (
                            <div className="text-xs" style={{ color: '#708090' }}>GPA: {edu.gpa}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resume?.skills && resume.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="font-bold mb-2 pb-1 border-b-2" style={{ color: '#001F3F', borderColor: '#50C878' }}>
                        SKILLS
                      </div>
                      <div className="text-xs" style={{ color: '#001F3F' }}>
                        {resume.skills.join(' • ')}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {(!resume?.personal_info?.full_name && !resume?.work_experience?.length && !resume?.education?.length && !resume?.skills?.length) && (
                    <div className="text-center py-12" style={{ color: '#708090' }}>
                      <FileText size={48} className="mx-auto mb-4" style={{ opacity: 0.3 }} />
                      <p>Your resume preview will appear here as you add content</p>
                    </div>
                  )}
                </div>

                {/* Export Buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`${API}/resumes/${resumeId}/export/pdf`, {
                          credentials: 'include',
                        });
                        if (!response.ok) throw new Error('Export failed');
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${resume.title || 'resume'}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      } catch (error) {
                        console.error('Export error:', error);
                        alert('Failed to export PDF');
                      }
                    }}
                    data-testid="export-resume-button"
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <DownloadSimple size={18} weight="bold" />
                    Export PDF
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`${API}/resumes/${resumeId}/export/word`, {
                          credentials: 'include',
                        });
                        if (!response.ok) throw new Error('Export failed');
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${resume.title || 'resume'}.docx`;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      } catch (error) {
                        console.error('Export error:', error);
                        alert('Failed to export Word document');
                      }
                    }}
                    data-testid="export-word-button"
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <DownloadSimple size={18} weight="bold" />
                    Export Word
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - ATS Score */}
          <div className="lg:col-span-1">
            {/* Score History Chart */}
            <div className="mb-6">
              <ScoreHistory resumeId={resumeId} />
            </div>

            <div className="card sticky top-8" data-testid="ats-score-panel">
              <h3 className="text-lg font-medium mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                ATS Score
              </h3>
              <div className="flex justify-center mb-6">
                <div className={`ats-score-circle ${getATSClass(atsScore)}`} data-testid="ats-score-value">
                  {atsScore}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="body-text-sm">Personal Info</span>
                  <span className="body-text-sm font-medium" style={{ color: '#001F3F' }}>
                    {resume.personal_info?.full_name ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-text-sm">Work Experience</span>
                  <span className="body-text-sm font-medium" style={{ color: '#001F3F' }}>
                    {resume.work_experience?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-text-sm">Education</span>
                  <span className="body-text-sm font-medium" style={{ color: '#001F3F' }}>
                    {resume.education?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-text-sm">Skills</span>
                  <span className="body-text-sm font-medium" style={{ color: '#001F3F' }}>
                    {resume.skills?.length || 0}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
                <p className="body-text-sm" style={{ color: '#708090' }}>
                  <strong>Target Market:</strong> {resume.region}
                </p>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* AI Suggestion Modal */}
      {showAiModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(0, 31, 63, 0.5)', zIndex: 50 }}
          data-testid="ai-suggestion-modal"
        >
          <div className="card max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-section">AI Suggestion</h2>
              <button
                onClick={() => setShowAiModal(false)}
                data-testid="close-ai-modal"
                style={{ color: '#708090' }}
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            {/* No-Fabrication Guardrail */}
            <div className="ai-guardrail-alert mb-4" data-testid="ai-guardrail-warning">
              <strong>No-Fabrication AI:</strong> Our AI never invents data. If specific metrics are missing,
              we&apos;ll flag them for you to add.
            </div>

            <div
              className="border rounded-sm p-4 mb-4 overflow-y-auto"
              style={{ borderColor: '#E2E8F0', minHeight: '150px', maxHeight: '50vh', backgroundColor: '#F8FAFC' }}
            >
              {aiLoading ? (
                <div className="flex items-center gap-2" style={{ color: '#708090' }}>
                  <Sparkle size={20} weight="bold" />
                  <span className="body-text-sm">Generating suggestion...</span>
                </div>
              ) : (
                <p className="body-text" data-testid="ai-suggestion-content" style={{ whiteSpace: 'pre-wrap' }}>
                  {aiSuggestion}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={applyAISuggestion}
                data-testid="apply-ai-suggestion"
                className="btn-primary flex items-center gap-2"
                disabled={aiLoading}
              >
                <Check size={18} weight="bold" />
                Apply Suggestion
              </button>
              <button
                onClick={() => setShowAiModal(false)}
                data-testid="cancel-ai-suggestion"
                className="btn-secondary"
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

export default ResumeBuilder;
