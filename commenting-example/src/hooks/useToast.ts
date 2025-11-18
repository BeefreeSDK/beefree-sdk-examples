import { useState, useCallback } from 'react'
import { ToastProps } from '../components/Toast'

interface ToastWithId extends ToastProps {
  id: string
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastWithId[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const newToast: ToastWithId = {
      ...toast,
      id,
      onClose: () => removeToast(id)
    }
    setToasts((prev) => [...prev, newToast])
    return id
  }, [removeToast])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts
  }
}
