// src/components/ui/use-toast.js
import { useEffect, useState } from "react"

const TOAST_TIMEOUT = 5000

const useToast = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => {
          if (toast.timestamp + TOAST_TIMEOUT > Date.now()) {
            return true
          }
          return false
        })
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const toast = ({ title, description, variant = "default", duration = TOAST_TIMEOUT }) => {
    const id = Date.now()
    const newToast = {
      id,
      title,
      description,
      variant,
      timestamp: Date.now(),
      duration,
    }
    setToasts((prevToasts) => [...prevToasts, newToast])

    return () => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }
  }

  return { toast, toasts }
}

export { useToast }
