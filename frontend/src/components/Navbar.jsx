import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, SignOut, CaretDown, Sparkle, ListBullets, TextAlignLeft, Camera, Target, Briefcase } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAIDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const aiTools = [
    { name: 'AI Headshot', icon: Camera, path: '/headshot-generator', color: '#06B6D4' },
    { name: 'Bullet Point Writer', icon: ListBullets, path: '/bullet-writer', color: '#8B5CF6' },
    { name: 'Summary Generator', icon: Sparkle, path: '/summary-generator', color: '#F59E0B' },
    { name: 'Cover Letter', icon: TextAlignLeft, path: '/cover-letter', color: '#3B82F6' },
    { name: 'STAR Builder', icon: Target, path: '/star-builder', color: '#EC4899' },
    { name: 'Job Ad Generator', icon: Briefcase, path: '/job-ad-generator', color: '#14B8A6' }
  ];

  return (
    <nav className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FileText size={32} weight="bold" style={{ color: '#001F3F' }} />
            <span className="text-2xl font-semibold" style={{ fontFamily: 'Outfit', color: '#001F3F' }}>
              ShortlistPro.cv
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className="body-text hover:opacity-70 transition-opacity"
              style={{ color: '#001F3F' }}
            >
              Dashboard
            </Link>

            {/* AI Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowAIDropdown(!showAIDropdown)}
                className="flex items-center gap-2 body-text hover:opacity-70 transition-opacity"
                style={{ color: '#001F3F' }}
              >
                <Sparkle size={18} weight="bold" style={{ color: '#50C878' }} />
                AI Tools
                <CaretDown size={16} style={{ transform: showAIDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {showAIDropdown && (
                <div 
                  className="absolute top-full right-0 mt-2 py-2 rounded-lg shadow-xl border z-50"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E2E8F0',
                    minWidth: '240px'
                  }}
                >
                  {aiTools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={index}
                        to={tool.path}
                        onClick={() => setShowAIDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div 
                          className="p-2 rounded"
                          style={{ backgroundColor: `${tool.color}15` }}
                        >
                          <Icon size={18} weight="bold" style={{ color: tool.color }} />
                        </div>
                        <span className="body-text-sm" style={{ color: '#001F3F' }}>
                          {tool.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link 
              to="/templates" 
              className="body-text hover:opacity-70 transition-opacity"
              style={{ color: '#001F3F' }}
            >
              Templates
            </Link>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4 pl-4" style={{ borderLeft: '1px solid #E2E8F0' }}>
              <span className="body-text-sm">
                <span style={{ color: '#708090' }}>Welcome, </span>
                <span style={{ color: '#001F3F', fontWeight: 500 }}>{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
                style={{ padding: '0.5rem 1rem' }}
              >
                <SignOut size={18} weight="bold" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
