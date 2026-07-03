import React from 'react';
import { Shield, CheckCircle, Lock } from '@phosphor-icons/react';

export const TrustIndicators = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8">
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ 
        backgroundColor: 'rgba(80, 200, 120, 0.08)',
        border: '1px solid rgba(80, 200, 120, 0.2)'
      }}>
        <Shield size={20} weight="fill" style={{ color: '#50C878' }} />
        <span className="text-sm font-medium" style={{ color: '#001F3F' }}>
          Bank-Level Security
        </span>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ 
        backgroundColor: 'rgba(80, 200, 120, 0.08)',
        border: '1px solid rgba(80, 200, 120, 0.2)'
      }}>
        <CheckCircle size={20} weight="fill" style={{ color: '#50C878' }} />
        <span className="text-sm font-medium" style={{ color: '#001F3F' }}>
          ATS-Verified
        </span>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ 
        backgroundColor: 'rgba(80, 200, 120, 0.08)',
        border: '1px solid rgba(80, 200, 120, 0.2)'
      }}>
        <Lock size={20} weight="fill" style={{ color: '#50C878' }} />
        <span className="text-sm font-medium" style={{ color: '#001F3F' }}>
          GDPR Compliant
        </span>
      </div>
    </div>
  );
};

export default TrustIndicators;
