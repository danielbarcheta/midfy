// src/components/FornecedorForm.jsx
import React from 'react'
import { Container, Typography, Box, Button, Alert, Paper } from '@mui/material'
import { Formik, Field, Form } from 'formik'
import { TextField, CheckboxWithLabel } from 'formik-mui'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

export default function FornecedorForm({ title, initialValues, onSubmit, isEditMode }) {
  const navigate = useNavigate()

  const schema = Yup.object({
    nome: Yup.string().required('Nome é obrigatório'),
    cnpj_principal: Yup.string().required('CNPJ Principal é obrigatório'),
  })

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper
        elevation={1}
        sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: '#ffffff',
          border: '1px solid #ddd',
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          {title}
        </Typography>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            setStatus(null)
            try {
              await onSubmit(values)
              navigate('/fornecedores')
            } catch (error) {
              const message = error?.response?.data?.error || error.message || ''
              if (
                message.includes('duplicate key value') ||
                message.includes('fornecedor_cnpjs_cnpj_key')
              ) {
                setStatus('Erro: CNPJ já cadastrado. Por favor, verifique e tente outro.')
              } else {
                setStatus('Erro ao salvar fornecedor')
              }
            }
            setSubmitting(false)
          }}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <Field
                component={TextField}
                name="nome"
                label="Nome"
                fullWidth
                margin="normal"
              />
              <Field
                component={TextField}
                name="cnpj_principal"
                label="CNPJ Principal"
                fullWidth
                margin="normal"
              />
              <Box mt={2}>
                <Field
                  component={CheckboxWithLabel}
                  type="checkbox"
                  name="ativo"
                  Label={{ label: 'Ativo' }}
                />
              </Box>
              {status && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {status}
                </Alert>
              )}
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isEditMode ? 'Salvar' : 'Criar'}
                </Button>
                <Button
                  variant="text"
                  onClick={() => navigate('/fornecedores')}
                >
                  Cancelar
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  )
}
