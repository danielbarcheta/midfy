import React, { useState } from 'react'
import { Container, Box, Typography, Button, Alert } from '@mui/material'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-mui'
import * as Yup from 'yup'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { user, loading, register } = useAuth() // use 'register' aqui
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  if (!loading && user) navigate('/fornecedores')

  return (
    <Container maxWidth="xs"><Box mt={8}>
      <Typography variant="h4" align="center">Cadastro</Typography>
      <Formik
        initialValues={{ email: '', password: '', passwordConfirm: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email().required('Email é obrigatório'),
          password: Yup.string().min(6, 'Senha muito curta').required('Senha é obrigatória'),
          passwordConfirm: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Senhas devem ser iguais')
            .required('Confirme a senha'),
        })}
        onSubmit={async (vals, { setSubmitting }) => {
          setError(null)
          try {
            await register(vals.email, vals.password) // chama register
            navigate('/fornecedores')
          } catch (e) {
            setError(e.message)
          }
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field component={TextField} name="email" label="Email" fullWidth margin="normal" />
            <Field component={TextField} name="password" type="password" label="Senha" fullWidth margin="normal" />
            <Field component={TextField} name="passwordConfirm" type="password" label="Confirme a senha" fullWidth margin="normal" />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={isSubmitting}>Cadastrar</Button>
          </Form>
        )}
      </Formik>
      <Box mt={2}>
        <Typography align="center">
          Já tem conta? <Button onClick={() => navigate('/login')}>Entrar</Button>
        </Typography>
      </Box>
    </Box></Container>
  )
}
