import React, { useState } from 'react';
import { X, Warning, Trash } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm();
      // Redirect will be handled by parent after successful deletion
    } catch (error) {
      console.error('Delete failed:', error);
      setIsDeleting(false);
      alert('Failed to delete account. Please try again or contact support.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="relative max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} style={{ color: '#64748B' }} />
        </button>

        {/* Header with Warning */}
        <div 
          className="relative px-8 pt-12 pb-8 text-center"
          style={{ backgroundColor: '#FEF2F2' }}
        >
          <div className="flex justify-center mb-4">
            <div 
              className="p-4 rounded-full"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <Warning size={48} weight="fill" style={{ color: '#DC2626' }} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Outfit', color: '#991B1B' }}>
            Delete Account?
          </h2>
          <p className="text-lg" style={{ color: '#DC2626' }}>
            This action cannot be undone
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Warning Message */}
          <div 
            className="mb-6 p-4 rounded-lg border-2"
            style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444' }}
          >
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#991B1B' }}>
              <Warning size={20} weight="bold" />
              Warning: Permanent Data Loss
            </h3>
            <p className="text-sm mb-3" style={{ color: '#7F1D1D' }}>
              Deleting your account will <strong>permanently remove</strong>:
            </p>
            <ul className="text-sm space-y-2 ml-4" style={{ color: '#7F1D1D' }}>
              <li>• All your resumes and cover letters</li>
              <li>• All AI-generated suggestions and content</li>
              <li>• Your subscription and payment history</li>
              <li>• Your personal information and account data</li>
              <li>• Access to all premium features</li>
            </ul>
          </div>

          {/* Information */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9' }}>
            <h4 className="font-semibold mb-2" style={{ color: '#001F3F' }}>
              Before you delete:
            </h4>
            <ul className="text-sm space-y-2" style={{ color: '#475569' }}>
              <li>✓ Download any resumes you want to keep</li>
              <li>✓ Cancel your subscription (if you have one)</li>
              <li>✓ This data cannot be recovered after deletion</li>
              <li>✓ Deletion takes effect immediately</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#001F3F' }}>
              Type <span style={{ color: '#DC2626' }}>DELETE MY ACCOUNT</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-red-500"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="Type here..."
              disabled={isDeleting}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE MY ACCOUNT' || isDeleting}
              className="w-full py-4 text-lg font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                fontFamily: 'Outfit',
                backgroundColor: confirmText === 'DELETE MY ACCOUNT' ? '#DC2626' : '#E5E7EB',
                color: confirmText === 'DELETE MY ACCOUNT' ? '#FFFFFF' : '#9CA3AF'
              }}
            >
              {isDeleting ? (
                <>Processing...</>
              ) : (
                <>
                  <Trash size={24} weight="bold" />
                  Yes, Delete My Account Permanently
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full btn-secondary py-3"
              style={{ fontFamily: 'Outfit' }}
            >
              Cancel, Keep My Account
            </button>
          </div>

          {/* GDPR Notice */}
          <p className="text-center text-xs mt-6" style={{ color: '#64748B' }}>
            Your data will be permanently deleted within 24 hours in compliance with GDPR regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
