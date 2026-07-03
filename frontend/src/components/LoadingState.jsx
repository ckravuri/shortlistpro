import React from 'react';
import { Sparkle } from '@phosphor-icons/react';

export const LoadingState = ({ message = 'Loading...', fullScreen = false }) => {
  const Container = fullScreen ? 'div' : React.Fragment;
  const containerProps = fullScreen ? {
    className: "min-h-screen flex items-center justify-center",
    style: { backgroundColor: '#F8FAFC' }
  } : {};

  return (
    <Container {...containerProps}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Spinning outer ring */}
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
            style={{ 
              borderTopColor: '#50C878',
              borderRightColor: '#50C878',
              animationDuration: '1s'
            }}
          ></div>
          
          {/* Inner icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkle size={24} weight="fill" style={{ color: '#50C878' }} />
          </div>
        </div>
        
        <p className="text-sm font-medium" style={{ color: '#475569' }}>
          {message}
        </p>
      </div>
    </Container>
  );
};

export default LoadingState;
