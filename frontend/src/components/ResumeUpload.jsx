import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { UploadSimple, FileText, FilePdf, ArrowsClockwise } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertingToPdf, setConvertingToPdf] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');

    try {
      // Use fetch instead of axios for better FormData + cookie handling
      const response = await fetch(`${API}/resumes/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important: send cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if it's a subscription limit error
        if (response.status === 403 && errorData.detail?.upgrade_required) {
          const detail = errorData.detail;
          throw new Error(`${detail.description}\n\nYou have ${detail.current_count}/${detail.limit} resumes.\n\nPlease upgrade to continue!`);
        }
        
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      // Navigate to resume builder
      navigate(`/resume/${data.id}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handlePdfToWord = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setConverting(true);
    setError('');

    try {
      const response = await fetch(`${API}/convert-pdf-to-word`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name.replace('.pdf', '.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || 'Failed to convert PDF to Word');
    } finally {
      setConverting(false);
    }
  };

  const handleWordToPdf = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setConvertingToPdf(true);
    setError('');

    try {
      const response = await fetch(`${API}/convert-word-to-pdf`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name.replace(/\.(docx?|DOCX?)$/, '.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || 'Failed to convert Word to PDF');
    } finally {
      setConvertingToPdf(false);
    }
  };

  return (
    <div className="card" data-testid="resume-upload-section">
      <div className="flex items-center gap-2 mb-4">
        <UploadSimple size={24} weight="bold" style={{ color: '#50C878' }} />
        <h3 className="text-lg font-medium" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
          Upload Existing Resume
        </h3>
      </div>
      <p className="body-text-sm mb-4">
        Upload your existing resume (PDF or DOCX) and we'll extract the information for you.
      </p>
      
      <label htmlFor="resume-upload" className="btn-primary inline-flex items-center gap-2 cursor-pointer">
        {uploading ? (
          'Uploading...'
        ) : (
          <>
            <FilePdf size={18} weight="bold" />
            Choose File (PDF/DOCX)
          </>
        )}
      </label>
      <input
        id="resume-upload"
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileUpload}
        disabled={uploading}
        className="hidden"
        data-testid="resume-upload-input"
      />
      
      {/* File Converters */}
      {user && user.subscription_tier !== 'free' && (
        <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2 mb-4">
            <ArrowsClockwise size={24} weight="bold" style={{ color: '#3B82F6' }} />
            <h3 className="text-lg font-medium" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              File Converters
            </h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#F59E0B15', color: '#F59E0B' }}>
              PRO
            </span>
          </div>
          
          <div className="space-y-4">
            {/* PDF to Word */}
            <div>
              <p className="body-text-sm mb-2">
                <strong>PDF → Word:</strong> Convert PDF resume to editable MS Word document
              </p>
              <label htmlFor="pdf-convert" className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
                {converting ? (
                  'Converting...'
                ) : (
                  <>
                    <FilePdf size={18} weight="bold" />
                    PDF to Word
                  </>
                )}
              </label>
              <input
                id="pdf-convert"
                type="file"
                accept=".pdf"
                onChange={handlePdfToWord}
                disabled={converting}
                className="hidden"
                data-testid="pdf-convert-input"
              />
            </div>

            {/* Word to PDF */}
            <div>
              <p className="body-text-sm mb-2">
                <strong>Word → PDF:</strong> Convert Word document to PDF format
              </p>
              <label htmlFor="word-convert" className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
                {convertingToPdf ? (
                  'Converting...'
                ) : (
                  <>
                    <FileText size={18} weight="bold" />
                    Word to PDF
                  </>
                )}
              </label>
              <input
                id="word-convert"
                type="file"
                accept=".docx,.doc"
                onChange={handleWordToPdf}
                disabled={convertingToPdf}
                className="hidden"
                data-testid="word-convert-input"
              />
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div
          className="mt-4 p-3 border-l-4 rounded-sm"
          style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#991B1B' }}
          data-testid="upload-error"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
