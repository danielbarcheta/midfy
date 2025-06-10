import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Register from './pages/Register'
import FornecedoresList from './pages/FornecedoresList'
import FornecedorDetails from './pages/FornecedorDetails'
import FornecedorEdit from './pages/FornecedorEdit'
import FornecedorCreate from './pages/FornecedorCreate'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p>Carregando...</p>
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/fornecedores" element={<PrivateRoute><FornecedoresList /></PrivateRoute>} />
          <Route path="/fornecedores/novo" element={<PrivateRoute><FornecedorCreate /></PrivateRoute>} />
          <Route path="/fornecedores/:id" element={<PrivateRoute><FornecedorDetails /></PrivateRoute>} />
          <Route path="/fornecedores/:id/editar" element={<PrivateRoute><FornecedorEdit /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/fornecedores" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}