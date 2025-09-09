import { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger',
}: ConfirmationModalProps) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: '⚠',
          confirmClass: 'btn-danger',
        };
      case 'warning':
        return {
          icon: '⚠',
          confirmClass: 'btn-warning',
        };
      case 'info':
        return {
          icon: 'ℹ',
          confirmClass: 'btn-primary',
        };
      default:
        return {
          icon: '⚠',
          confirmClass: 'btn-danger',
        };
    }
  };

  const { icon, confirmClass } = getVariantStyles();

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onCancel} />
      <div className="modal-container" data-variant={variant}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <span className="modal-icon">{icon}</span>
            <h2>{title}</h2>
          </div>
          <button
            className="modal-close"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          <p className="confirmation-message">{message}</p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${confirmClass}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
