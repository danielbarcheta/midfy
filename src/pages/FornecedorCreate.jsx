import React from 'react'
import FornecedorForm from '../components/FornecedorForm'
import { useFornecedorService } from '../api/apiFornecedor'

export default function FornecedorCreate() {
  const { criarFornecedor } = useFornecedorService()

  const initialValues = { nome: '', cnpj_principal: '', ativo: true }

  return (
    <FornecedorForm
      title="Novo Fornecedor"
      initialValues={initialValues}
      onSubmit={criarFornecedor}
      isEditMode={false}
    />
  )
}
