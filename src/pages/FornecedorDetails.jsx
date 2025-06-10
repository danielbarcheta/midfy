import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Chip, Container, Paper, CircularProgress } from '@mui/material'
import { useFornecedorService } from '../api/apiFornecedor'
import { useNavigate, useParams } from 'react-router-dom'

export default function FornecedorDetails() {
  const { id } = useParams()
  const [f, setF] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { getFornecedor } = useFornecedorService()

  useEffect(() => {
    getFornecedor(id).then(d => setF(d)).finally(() => setLoading(false))
  }, [id, getFornecedor])

  if (loading)
    return (
      <Container
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#fafafa',
        }}
      >
        <CircularProgress color="inherit" />
      </Container>
    )
  if (!f)
    return (
      <Container
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#fafafa',
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Não encontrado
        </Typography>
      </Container>
    )

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper
        elevation={1}
        sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: '#fff',
          border: '1px solid #ddd',
          boxShadow: 'none',
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: 600, color: '#333', textAlign: 'center' }}
        >
          {f.nome}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: '#555', mb: 0.5 }}>Descrição:</Typography>
          <Typography sx={{ color: '#666' }}>{f.descricao || '—'}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: '#555', mb: 0.5 }}>CNPJ Principal:</Typography>
          <Typography sx={{ color: '#666' }}>{f.cnpj_principal}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: '#555', mb: 0.5 }}>Ativo:</Typography>
          <Typography sx={{ color: f.ativo ? 'green' : 'red', fontWeight: '600' }}>
            {f.ativo ? 'Sim' : 'Não'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: '#555', mb: 1 }}>Segmentos:</Typography>
          {f.segmentos?.length ? (
            f.segmentos.map(s => (
              <Chip
                key={s.id}
                label={s.nome}
                sx={{
                  mr: 1,
                  mb: 1,
                  bgcolor: '#f0f0f0',
                  color: '#444',
                  fontWeight: 500,
                }}
              />
            ))
          ) : (
            <Typography sx={{ color: '#999', fontStyle: 'italic' }}>Nenhum segmento</Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/fornecedores/${id}/editar`)}
            sx={{
              color: '#555',
              borderColor: '#bbb',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#888',
                backgroundColor: '#f4f4f4',
              },
            }}
          >
            Editar
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/fornecedores')}
            sx={{ color: '#888', textTransform: 'none' }}
          >
            Voltar
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
