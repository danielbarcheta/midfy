import { useCallback } from 'react'
import useAxiosEdge from './axiosEdge'

const BASE = '/manage-fornecedor'

export const useFornecedorService = () => {
  const axiosEdge = useAxiosEdge()

  const listarFornecedores = useCallback(() =>
    axiosEdge.get(BASE).then(res => res.data)
  , [axiosEdge])

  const getFornecedor = useCallback((id) =>
    axiosEdge.get(`${BASE}/${id}`).then(res => res.data)
  , [axiosEdge])

  const criarFornecedor = useCallback((data) =>
    axiosEdge.post(BASE, data).then(res => res.data)
  , [axiosEdge])

  const atualizarFornecedor = useCallback((id, data) =>
    axiosEdge.patch(`${BASE}/${id}`, data).then(res => res.data)
  , [axiosEdge])

  const deletarFornecedor = useCallback((id) =>
    axiosEdge.delete(`${BASE}/${id}`).then(res => res.data)
  , [axiosEdge])

  return {
    listarFornecedores,
    getFornecedor,
    criarFornecedor,
    atualizarFornecedor,
    deletarFornecedor
  }
}
