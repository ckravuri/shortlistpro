import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Users, ChartBar, FileText, Crown, ArrowLeft } from '@phosphor-icons/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/stats`, { withCredentials: true });
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown size={28} weight="bold" style={{ color: '#50C878' }} />
            <span className="text-xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              Admin Dashboard
            </span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={18} weight="bold" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card" data-testid="stat-total-users">
            <div className="flex items-center gap-3 mb-2">
              <Users size={24} weight="bold" style={{ color: '#50C878' }} />
              <span className="input-label">Total Users</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#001F3F' }}>{stats?.total_users || 0}</p>
          </div>

          <div className="card" data-testid="stat-free-users">
            <div className="flex items-center gap-3 mb-2">
              <Users size={24} weight="bold" style={{ color: '#708090' }} />
              <span className="input-label">Free Tier</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#708090' }}>{stats?.subscription_breakdown?.free || 0}</p>
          </div>

          <div className="card" data-testid="stat-pro-users">
            <div className="flex items-center gap-3 mb-2">
              <ChartBar size={24} weight="bold" style={{ color: '#50C878' }} />
              <span className="input-label">Pro Tier</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#50C878' }}>{stats?.subscription_breakdown?.pro || 0}</p>
          </div>

          <div className="card" data-testid="stat-pro-plus-users">
            <div className="flex items-center gap-3 mb-2">
              <Crown size={24} weight="bold" style={{ color: '#001F3F' }} />
              <span className="input-label">Pro+ Tier</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#001F3F' }}>{stats?.subscription_breakdown?.pro_plus || 0}</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={24} weight="bold" style={{ color: '#50C878' }} />
              <span className="input-label">Total Resumes Created</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#001F3F' }}>{stats?.total_resumes || 0}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Users size={24} weight="bold" style={{ color: '#50C878' }} />
              <span className="input-label">New Users (30 days)</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#001F3F' }}>{stats?.recent_users_30d || 0}</p>
          </div>
        </div>

        {/* Users List */}
        <div className="card">
          <h2 className="heading-section mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#E2E8F0' }}>
                  <th className="text-left p-3 body-text-sm font-semibold" style={{ color: '#001F3F' }}>Name</th>
                  <th className="text-left p-3 body-text-sm font-semibold" style={{ color: '#001F3F' }}>Email</th>
                  <th className="text-left p-3 body-text-sm font-semibold" style={{ color: '#001F3F' }}>Subscription</th>
                  <th className="text-left p-3 body-text-sm font-semibold" style={{ color: '#001F3F' }}>Role</th>
                  <th className="text-left p-3 body-text-sm font-semibold" style={{ color: '#001F3F' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats?.users?.map((u) => (
                  <tr key={u.id} className="border-b" style={{ borderColor: '#E2E8F0' }}>
                    <td className="p-3 body-text-sm">{u.name}</td>
                    <td className="p-3 body-text-sm">{u.email}</td>
                    <td className="p-3 body-text-sm">
                      <span
                        className="px-2 py-1 rounded-sm text-xs font-medium"
                        style={{
                          backgroundColor: u.subscription_tier === 'pro+' ? '#001F3F' : u.subscription_tier === 'pro' ? '#50C878' : '#F8FAFC',
                          color: u.subscription_tier === 'free' ? '#708090' : '#FFFFFF'
                        }}
                      >
                        {u.subscription_tier || 'free'}
                      </span>
                    </td>
                    <td className="p-3 body-text-sm">{u.role}</td>
                    <td className="p-3 body-text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
