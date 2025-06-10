import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import StorefrontIcon from '@mui/icons-material/Storefront'
import logo from '../assets/logo.svg'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(180deg, #ffc0cb33 0%, #ffffff 100%)',
        boxShadow: '0 2px 4px 0 rgba(255, 192, 203, 0.2)',
        color: '#666666',
        backdropFilter: 'blur(8px)',
      }}
      elevation={0}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <Box display="flex" alignItems="center">
              <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
            </Box>
          </Link>
        </Typography>

        {user ? (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/fornecedores"
              startIcon={<StorefrontIcon />}
              sx={{
                color: '#666666',
                '&:hover': {
                  backgroundColor: '#f8bbd0',
                },
              }}
            >
              Fornecedores
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ color: '#e91e63' }}
            >
              <LogoutIcon />
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login" sx={{ color: '#666666' }}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
