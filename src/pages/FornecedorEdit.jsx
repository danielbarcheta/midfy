import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FornecedorForm from '../components/FornecedorForm'
import { useFornecedorService } from '../api/apiFornecedor'

export default function FornecedorEdit() {
  const { id } = useParams()
  const [initialValues, setInitialValues] = useState({ nome: '', cnpj_principal: '', ativo: true })
  const [loading, setLoading] = useState(true)
  const { getFornecedor, atualizarFornecedor } = useFornecedorService()

  useEffect(() => {
    getFornecedor(id).then(data => {
      const { nome, cnpj_principal, ativo } = data
      setInitialValues({ nome, cnpj_principal, ativo })
      setLoading(false)
    })
  }, [id, getFornecedor])

  if (loading) return <p>Carregando...</p>

  return (
    <FornecedorForm
      title="Editar Fornecedor"
      initialValues={initialValues}
      onSubmit={(values) => atualizarFornecedor(id, values)}
      isEditMode={true}
    />
  )
}
