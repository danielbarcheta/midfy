import supabase from '../supabase/supabaseClient'
import { useEffect, useState, createContext, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setUser(data.session.user)
        setToken(data.session.access_token)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
        setToken(session.access_token)
      } else {
        setUser(null)
        setToken(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const register = async (email, password) => {
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
