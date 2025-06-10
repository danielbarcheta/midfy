import React, { useState } from 'react'
import { Container, Box, Typography, Button, Alert, InputAdornment } from '@mui/material'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-mui'
import * as Yup from 'yup'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import { grey } from '@mui/material/colors'
import logo from '../assets/logo.svg'

export default function Login() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  if (!loading && user) navigate('/fornecedores')

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: '100%',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      >
        <Box mb={4}>
          <img src={logo} alt="Logo" style={{ height: 56, marginBottom: 12 }} />
          <Typography variant="h4" fontWeight={700} mb={3} sx={{ color: grey[800] }}>
            Entrar na sua conta
          </Typography>
        </Box>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Email inválido').required('Obrigatório'),
            password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
          })}
          onSubmit={async (vals, { setSubmitting }) => {
            setError(null)
            try {
              await login(vals.email, vals.password)
              navigate('/fornecedores')
            } catch (e) {
              setError(e.message)
            }
            setSubmitting(false)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                component={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: grey[700] }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Field
                component={TextField}
                name="password"
                type="password"
                label="Senha"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: grey[700] }} />
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #e91e63, #f48fb1)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #d81b60, #f06292)',
                  },
                }}
                disabled={isSubmitting}
              >
                Entrar
              </Button>
            </Form>
          )}
        </Formik>

        <Box mt={3}>
          <Typography variant="body2" color={grey[700]}>
            Não tem conta?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/register')}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                color: '#e91e63',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Cadastrar
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}
