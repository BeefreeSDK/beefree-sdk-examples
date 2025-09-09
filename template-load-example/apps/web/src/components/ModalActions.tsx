import { ReactNode } from 'react';

export interface ModalActionsProps {
  children: ReactNode;
  className?: string;
}

export const ModalActions = ({
  children,
  className = '',
}: ModalActionsProps) => {
  return <div className={`modal-actions ${className}`}>{children}</div>;
};

export interface ModalButtonProps {
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ModalButton = ({
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  children,
  className = '',
}: ModalButtonProps) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'secondary':
        return 'btn-secondary';
      default:
        return 'btn-primary';
    }
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};
