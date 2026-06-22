import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Microphone, Plus, Trash, ArrowLeft, Check } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const STARBuilder = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    situation: '',
    task: '',
    action: '',
    result: '',
    job_title: ''
  });
  const [isRecording, setIsRecording] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get(`${API}/star-entries`, { withCredentials: true });
      setEntries(data);
    } catch (error) {
      console.error('Error fetching STAR entries:', error);
    }
  };

  const startVoiceInput = (field) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setCurrentField(field);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCurrentEntry(prev => ({ ...prev, [field]: prev[field] + ' ' + transcript }));
      setIsRecording(false);
      setCurrentField('');
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setCurrentField('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setCurrentField('');
    };

    recognition.start();
  };

  const saveEntry = async () => {
    if (!currentEntry.situation || !currentEntry.task || !currentEntry.action || !currentEntry.result) {
      alert('Please fill in all STAR fields');
      return;
    }

    try {
      await axios.post(`${API}/star-entries`, currentEntry, { withCredentials: true });
      fetchEntries();
      setCurrentEntry({ situation: '', task: '', action: '', result: '', job_title: '' });
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      await axios.delete(`${API}/star-entries/${entryId}`, { withCredentials: true });
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            data-testid="back-to-dashboard"
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={18} weight="bold" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="heading-section mb-2">STAR Format Builder</h1>
        <p className="body-text mb-8">
          Build compelling selection criteria responses for Australian Government positions using the STAR method.
          Use voice input or type your responses.
        </p>

        {/* Current Entry Form */}
        <div className="card mb-8" data-testid="star-entry-form">
          <div className="mb-4">
            <label className="input-label">Job Title / Position</label>
            <input
              type="text"
              className="input-field"
              value={currentEntry.job_title}
              onChange={(e) => setCurrentEntry({ ...currentEntry, job_title: e.target.value })}
              placeholder="e.g., Policy Officer"
              data-testid="input-job-title"
            />
          </div>

          {['situation', 'task', 'action', 'result'].map((field) => (
            <div key={field} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="input-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <button
                  onClick={() => startVoiceInput(field)}
                  className="btn-secondary flex items-center gap-1"
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                  disabled={isRecording}
                  data-testid={`voice-${field}`}
                >
                  <Microphone size={14} weight="bold" />
                  {isRecording && currentField === field ? 'Listening...' : 'Voice'}
                </button>
              </div>
              <textarea
                className="input-field"
                rows={4}
                value={currentEntry[field]}
                onChange={(e) => setCurrentEntry({ ...currentEntry, [field]: e.target.value })}
                placeholder={`Describe the ${field}...`}
                data-testid={`input-${field}`}
              />
            </div>
          ))}

          <button
            onClick={saveEntry}
            className="btn-primary flex items-center gap-2"
            data-testid="save-star-entry"
          >
            <Check size={18} weight="bold" />
            Save Entry
          </button>
        </div>

        {/* Saved Entries */}
        <div>
          <h2 className="heading-section mb-4">Saved STAR Entries ({entries.length})</h2>
          {entries.length === 0 ? (
            <div className="card text-center py-8">
              <p className="body-text">No saved entries yet. Create your first STAR entry above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="card" data-testid={`star-entry-${entry.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
                      {entry.job_title || 'Untitled Entry'}
                    </h3>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      style={{ color: '#EF4444' }}
                      data-testid={`delete-entry-${entry.id}`}
                    >
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong className="body-text-sm" style={{ color: '#001F3F' }}>Situation:</strong>
                      <p className="body-text-sm">{entry.situation}</p>
                    </div>
                    <div>
                      <strong className="body-text-sm" style={{ color: '#001F3F' }}>Task:</strong>
                      <p className="body-text-sm">{entry.task}</p>
                    </div>
                    <div>
                      <strong className="body-text-sm" style={{ color: '#001F3F' }}>Action:</strong>
                      <p className="body-text-sm">{entry.action}</p>
                    </div>
                    <div>
                      <strong className="body-text-sm" style={{ color: '#001F3F' }}>Result:</strong>
                      <p className="body-text-sm">{entry.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default STARBuilder;
