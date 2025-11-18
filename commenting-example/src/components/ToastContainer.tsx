import { Toast, ToastProps } from './Toast'

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>
  onRemoveToast: (id: string) => void
}

export const ToastContainer = ({ toasts, onRemoveToast }: ToastContainerProps) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          author={toast.author}
          content={toast.content}
          onClose={() => onRemoveToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  )
}
