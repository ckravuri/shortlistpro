import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadSimple, FileText, FilePdf } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
