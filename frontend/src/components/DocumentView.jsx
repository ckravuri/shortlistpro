import React from 'react';
import { DownloadSimple, PencilSimple } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const DocumentView = ({ resume, resumeId, onEdit }) => {
  const handleExportPDF = async () => {
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
  };

  const handleExportWord = async () => {
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
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Document Toolbar */}
      <div className="card mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
            Full Document View
          </h2>
          <p className="body-text-sm mt-1">
            Review your complete resume. Click any section to edit in Form View.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="btn-primary flex items-center gap-2"
            data-testid="doc-export-pdf"
          >
            <DownloadSimple size={18} weight="bold" />
            Export PDF
          </button>
          <button
            onClick={handleExportWord}
            className="btn-secondary flex items-center gap-2"
            data-testid="doc-export-word"
          >
            <DownloadSimple size={18} weight="bold" />
            Export Word
          </button>
        </div>
      </div>

      {/* Document Content - MS Word Style */}
      <div 
        className="card"
        style={{
          minHeight: '11in',
          maxWidth: '8.5in',
          margin: '0 auto',
          padding: '1in',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontFamily: 'Calibri, sans-serif',
          lineHeight: '1.5'
        }}
      >
        {/* Personal Info - Header */}
        <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: '#001F3F' }}>
          <h1 
            className="text-4xl font-bold mb-2" 
            style={{ color: '#001F3F', fontFamily: 'Calibri, sans-serif' }}
          >
            {resume.personal_info?.full_name || 'Your Name'}
          </h1>
          <div className="flex justify-center flex-wrap gap-3 text-sm" style={{ color: '#708090' }}>
            {resume.personal_info?.email && <span>{resume.personal_info.email}</span>}
            {resume.personal_info?.phone && <span>•</span>}
            {resume.personal_info?.phone && <span>{resume.personal_info.phone}</span>}
            {resume.personal_info?.location && <span>•</span>}
            {resume.personal_info?.location && <span>{resume.personal_info.location}</span>}
          </div>
          {resume.personal_info?.linkedin && (
            <div className="text-sm mt-1" style={{ color: '#3B82F6' }}>
              {resume.personal_info.linkedin}
            </div>
          )}
          {resume.personal_info?.website && (
            <div className="text-sm" style={{ color: '#3B82F6' }}>
              {resume.personal_info.website}
            </div>
          )}
        </div>

        {/* Professional Summary */}
        {resume.personal_info?.summary && (
          <div className="mb-6">
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b" 
              style={{ color: '#001F3F', borderColor: '#E2E8F0' }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-base" style={{ color: '#001F3F', textAlign: 'justify' }}>
              {resume.personal_info.summary}
            </p>
            <button
              onClick={() => onEdit('summary')}
              className="mt-2 text-sm flex items-center gap-1"
              style={{ color: '#50C878' }}
            >
              <PencilSimple size={14} weight="bold" />
              Edit
            </button>
          </div>
        )}

        {/* Work Experience */}
        {resume.work_experience && resume.work_experience.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b" 
              style={{ color: '#001F3F', borderColor: '#E2E8F0' }}
            >
              WORK EXPERIENCE
            </h2>
            {resume.work_experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: '#001F3F' }}>
                      {exp.position || 'Position Title'}
                    </h3>
                    {exp.company && (
                      <div className="text-base font-semibold" style={{ color: '#708090' }}>
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </div>
                    )}
                    {!exp.company && exp.location && (
                      <div className="text-base font-semibold" style={{ color: '#708090' }}>
                        {exp.location}
                      </div>
                    )}
                  </div>
                  <div className="text-sm" style={{ color: '#708090' }}>
                    {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-base mb-2" style={{ color: '#001F3F' }}>
                    {exp.description}
                  </p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-base" style={{ color: '#001F3F' }}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <button
              onClick={() => onEdit('work_experience')}
              className="mt-2 text-sm flex items-center gap-1"
              style={{ color: '#50C878' }}
            >
              <PencilSimple size={14} weight="bold" />
              Edit Work Experience
            </button>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b" 
              style={{ color: '#001F3F', borderColor: '#E2E8F0' }}
            >
              EDUCATION
            </h2>
            {resume.education.map((edu, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold" style={{ color: '#001F3F' }}>
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h3>
                    <div className="text-base" style={{ color: '#708090' }}>
                      {edu.institution}
                    </div>
                    {edu.gpa && (
                      <div className="text-sm" style={{ color: '#708090' }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                  <div className="text-sm" style={{ color: '#708090' }}>
                    {edu.start_date} - {edu.end_date}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => onEdit('education')}
              className="mt-2 text-sm flex items-center gap-1"
              style={{ color: '#50C878' }}
            >
              <PencilSimple size={14} weight="bold" />
              Edit Education
            </button>
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-xl font-bold mb-3 pb-2 border-b" 
              style={{ color: '#001F3F', borderColor: '#E2E8F0' }}
            >
              SKILLS
            </h2>
            <div className="text-base" style={{ color: '#001F3F' }}>
              {resume.skills.join(' • ')}
            </div>
            <button
              onClick={() => onEdit('skills')}
              className="mt-2 text-sm flex items-center gap-1"
              style={{ color: '#50C878' }}
            >
              <PencilSimple size={14} weight="bold" />
              Edit Skills
            </button>
          </div>
        )}

        {/* Empty State */}
        {(!resume.personal_info?.full_name && 
          !resume.work_experience?.length && 
          !resume.education?.length && 
          !resume.skills?.length) && (
          <div className="text-center py-12" style={{ color: '#708090' }}>
            <p className="text-lg mb-4">Your resume is empty</p>
            <button
              onClick={() => onEdit('start')}
              className="btn-primary"
            >
              Start Building Your Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentView;
