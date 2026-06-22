import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, ArrowLeft, UploadSimple } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const HeadshotGenerator = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [generatedHeadshot, setGeneratedHeadshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setGeneratedHeadshot(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const generateHeadshot = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        `${API}/generate-headshot`,
        { image_data: selectedImage },
        { withCredentials: true }
      );
      setGeneratedHeadshot(data.headshot_url);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate headshot');
    } finally {
      setLoading(false);
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Camera size={32} weight="bold" style={{ color: '#50C878' }} />
          <h1 className="heading-section">AI Headshot Generator</h1>
        </div>
        <p className="body-text mb-8">
          Upload a selfie and our AI will generate a professional corporate headshot with improved lighting and background.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="card">
            <h3 className="text-lg font-medium mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Your Selfie
            </h3>
            {selectedImage ? (
              <div>
                <img src={selectedImage} alt="Selected" className="w-full rounded-sm mb-4" />
                <label htmlFor="image-upload" className="btn-secondary w-full cursor-pointer flex items-center justify-center gap-2">
                  <UploadSimple size={18} weight="bold" />
                  Choose Different Photo
                </label>
              </div>
            ) : (
              <label htmlFor="image-upload" className="block cursor-pointer">
                <div
                  className="border-2 border-dashed rounded-sm p-12 text-center"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <Camera size={48} weight="thin" style={{ color: '#708090', margin: '0 auto 1rem' }} />
                  <p className="body-text">Click to upload a selfie</p>
                  <p className="body-text-sm">JPG, PNG (max 5MB)</p>
                </div>
              </label>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              data-testid="headshot-image-upload"
            />

            {selectedImage && (
              <button
                onClick={generateHeadshot}
                disabled={loading}
                className="btn-primary w-full mt-4"
                data-testid="generate-headshot-btn"
              >
                {loading ? 'Generating...' : 'Generate Professional Headshot'}
              </button>
            )}
          </div>

          {/* Result Section */}
          <div className="card">
            <h3 className="text-lg font-medium mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Professional Headshot
            </h3>
            {generatedHeadshot ? (
              <div>
                <img src={generatedHeadshot} alt="Generated Headshot" className="w-full rounded-sm" data-testid="generated-headshot" />
                <p className="body-text-sm mt-4" style={{ color: '#50C878' }}>
                  ✓ Headshot saved to your profile
                </p>
              </div>
            ) : (
              <div
                className="border rounded-sm p-12 text-center"
                style={{ borderColor: '#E2E8F0', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <p className="body-text">Your professional headshot will appear here</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 border-l-4 rounded-sm" style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#991B1B' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadshotGenerator;
