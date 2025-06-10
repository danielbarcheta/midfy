import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Box,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFornecedorService } from '../api/apiFornecedor'
import { useNavigate } from 'react-router-dom'

export default function FornecedoresList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [del, setDel] = useState(null)
  const navigate = useNavigate()
  const { listarFornecedores, deletarFornecedor } = useFornecedorService()

useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const fornecedores = await listarFornecedores()
      setData(fornecedores)
    } catch (error) {}
    setLoading(false)
  }
  fetchData()
}, [listarFornecedores]) 


  const refreshList = async () => {
    setLoading(true)
    try {
      const fornecedores = await listarFornecedores()
      setData(fornecedores)
    } catch (error) {}
    setLoading(false)
  }

  return (
    <>

      <Container maxWidth="lg" className="container">
        <Typography variant="h3" className="title">
          Fornecedores
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/fornecedores/novo')}
          className="btnNovo"
        >
          Novo
        </Button>

        <TableContainer component={Paper} elevation={3} className="tableContainer">
          <Table>
            <TableHead className="tableHead">
              <TableRow>
                <TableCell className="tableHeadCell">Nome</TableCell>
                <TableCell className="tableHeadCell">CNPJ</TableCell>
                <TableCell className="tableHeadCellCenterWide">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((f) => (
                <TableRow key={f.id} hover className="tableRow">
                  <TableCell
                    onClick={() => navigate(`/fornecedores/${f.id}`)}
                    className="tableCellNome"
                  >
                    {f.nome}
                  </TableCell>
                  <TableCell className="tableCellCnpj">{f.cnpj_principal}</TableCell>
                  <TableCell
                    className="tableCellActions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconButton
                      aria-label="editar"
                      className="iconButtonEdit"
                      onClick={() => navigate(`/fornecedores/${f.id}/editar`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="deletar"
                      className="iconButtonDelete"
                      onClick={() => setDel(f)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={!!del} onClose={() => setDel(null)}>
          <DialogTitle className="dialogTitle">Excluir {del?.nome}?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDel(null)} className="dialogButtonCancel">
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                await deletarFornecedor(del.id)
                setDel(null)
                refreshList()
              }}
              className="dialogButtonExcluir"
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <style>{`
        .container {
          font-family: 'Poppins', sans-serif;
          margin-top: 32px;
          margin-bottom: 48px;
          color: #444;
          min-height: 80vh;
        }
        .title {
          font-weight: 700;
          color: #c01c77;
          letter-spacing: 1px;
          font-family: 'Poppins', sans-serif;
          margin-bottom: 32px;
        }
        .btnNovo {
          margin-bottom: 24px;
          background-color: #c01c77;
          font-weight: 600;
          letter-spacing: 0.5px;
          border-radius: 8px;
          text-transform: none;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 4px 8px rgba(192, 28, 119, 0.3);
          transition: background-color 0.3s ease;
        }
        .btnNovo:hover {
          background-color: #9a155e;
        }
        .tableContainer {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          background-color: #fff;
        }
        .tableHead {
          /* Removed gradient here */
        }
        .tableHeadCell {
          font-weight: 700;
          color: #c01c77;
          font-family: 'Poppins', sans-serif;
        }
        .tableHeadCellCenter {
          font-weight: 700;
          color: #c01c77;
          font-family: 'Poppins', sans-serif;
          width: 80px;
          text-align: center;
        }
        .tableHeadCellCenterWide {
          font-weight: 700;
          color: #c01c77;
          font-family: 'Poppins', sans-serif;
          width: 120px;
          text-align: center;
        }
        .tableRow:hover {
          background-color: #fce9f5;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .tableCellNome {
          font-weight: 600;
          color: #333;
          font-family: 'Poppins', sans-serif;
        }
        .tableCellCnpj {
          font-family: 'Poppins', sans-serif;
          color: #666;
        }
        .tableCellAtivoTrue {
          text-align: center;
          color: #388e3c;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }
        .tableCellAtivoFalse {
          text-align: center;
          color: #d32f2f;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }
        .tableCellActions {
          text-align: center;
        }
        .iconButtonEdit {
          color: #666;
          transition: color 0.3s ease;
        }
        .iconButtonEdit:hover {
          color: #c01c77;
        }
        .iconButtonDelete {
          color: #a00;
          transition: color 0.3s ease;
        }
        .iconButtonDelete:hover {
          color: #c01c77;
        }
        .dialogTitle {
          font-family: 'Poppins', sans-serif;
          color: #333;
        }
        .dialogButtonCancel {
          font-family: 'Poppins', sans-serif;
          text-transform: none;
          color: #666;
        }
        .dialogButtonExcluir {
          font-family: 'Poppins', sans-serif;
          text-transform: none;
          font-weight: 600;
          color: #c01c77;
          transition: background-color 0.3s ease;
        }
        .dialogButtonExcluir:hover {
          background-color: #f4d4e0;
        }
      `}</style>
    </>
  )
}
