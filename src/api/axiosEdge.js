import { useMemo } from 'react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

const axiosEdgeInstance = axios.create({
  baseURL: 'https://xjhkvillgoxvytihxwdm.supabase.co/functions/v1',
  headers: {
    'Content-Type': 'application/json',
  }
})

const useAxiosEdge = () => {
  const { token } = useAuth()

  const axiosEdge = useMemo(() => {
    // Limpa interceptors para evitar múltiplos acúmulos
    axiosEdgeInstance.interceptors.request.handlers = []

    axiosEdgeInstance.interceptors.request.use(config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        delete config.headers.Authorization
      }
      return config
    })

    return axiosEdgeInstance
  }, [token])

  return axiosEdge
}

export default useAxiosEdge
