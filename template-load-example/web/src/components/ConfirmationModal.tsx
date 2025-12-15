import { BaseModal } from './BaseModal';
import { ModalActions, ModalButton } from './ModalActions';

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
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: '⚠',
          confirmVariant: 'danger' as const,
        };
      case 'warning':
        return {
          icon: '⚠',
          confirmVariant: 'warning' as const,
        };
      case 'info':
        return {
          icon: 'ℹ',
          confirmVariant: 'primary' as const,
        };
      default:
        return {
          icon: '⚠',
          confirmVariant: 'danger' as const,
        };
    }
  };

  const { icon, confirmVariant } = getVariantStyles();

  return (
    <BaseModal
      isOpen={isOpen}
      title={
        <div className="modal-title-with-icon">
          <span className="modal-icon">{icon}</span>
          <span>{title}</span>
        </div>
      }
      onClose={onCancel}
      loading={loading}
      variant={variant}
    >
      <p className="confirmation-message">{message}</p>

      <ModalActions>
        <ModalButton variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelText}
        </ModalButton>
        <ModalButton
          variant={confirmVariant}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </ModalButton>
      </ModalActions>
    </BaseModal>
  );
};
