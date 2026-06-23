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
      const { data } = await axios.post(`${API}/resumes/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Navigate to resume builder
      navigate(`/resume/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handlePdfToWord = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tier = user?.subscription_tier || 'free';
    if (tier === 'free') {
      setError('PDF to Word conversion is available for Pro and Pro+ users only. Please upgrade your plan.');
      return;
    }

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

    const tier = user?.subscription_tier || 'free';
    if (tier === 'free') {
      setError('Word to PDF conversion is available for Pro and Pro+ users only. Please upgrade your plan.');
      return;
    }

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
      
      {/* PDF to Word Converter */}
      {user && user.subscription_tier !== 'free' && (
        <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2 mb-4">
            <ArrowsClockwise size={24} weight="bold" style={{ color: '#3B82F6' }} />
            <h3 className="text-lg font-medium" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Convert PDF to Word
            </h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#F59E0B15', color: '#F59E0B' }}>
              PRO
            </span>
          </div>
          <p className="body-text-sm mb-4">
            Upload a PDF resume and download it as an editable MS Word document.
          </p>
          
          <label htmlFor="pdf-convert" className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
            {converting ? (
              'Converting...'
            ) : (
              <>
                <FilePdf size={18} weight="bold" />
                Convert PDF to Word
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
