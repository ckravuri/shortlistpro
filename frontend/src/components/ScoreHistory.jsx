import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ScoreHistory = ({ resumeId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [resumeId]);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(`${API}/resumes/${resumeId}/score-history`, { withCredentials: true });
      // Format data for chart
      const formatted = data.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        score: entry.score
      }));
      setHistory(formatted);
    } catch (error) {
      console.error('Error fetching score history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="body-text">Loading history...</div>;
  if (history.length === 0) return null;

  return (
    <div className="card" data-testid="score-history-chart">
      <h3 className="text-lg font-medium mb-4" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
        ATS Score Progress
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="date" style={{ fontSize: '12px', fill: '#708090' }} />
          <YAxis domain={[0, 100]} style={{ fontSize: '12px', fill: '#708090' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0.125rem' }}
          />
          <Line type="monotone" dataKey="score" stroke="#50C878" strokeWidth={2} dot={{ fill: '#50C878' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreHistory;
