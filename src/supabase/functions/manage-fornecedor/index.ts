import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const supplierId = pathSegments[1] || null

    const validateCNPJ = (cnpj: string) => {
      const cleanCNPJ = cnpj.replace(/\D/g, '')
      if (cleanCNPJ.length !== 14 || /^(\d)\1+$/.test(cleanCNPJ)) return false
      return true
    }

    switch (method) {
      case 'GET':
        if (supplierId) {
          const { data, error } = await supabaseClient
            .from('fornecedores_completo')
            .select('*')
            .eq('id', supplierId)
            .single()

          if (error) throw error
          return new Response(JSON.stringify(data), { status: 200 })
        } else {
          const { data, error } = await supabaseClient
            .from('fornecedores_busca')
            .select('*')

          if (error) throw error
          return new Response(JSON.stringify(data), { status: 200 })
        }

      case 'POST': {
        const body = await req.json()

        if (!body.nome) {
          return new Response(JSON.stringify({ error: 'Nome é obrigatório' }), { status: 400 })
        }

        if (body.cnpj_principal && !validateCNPJ(body.cnpj_principal)) {
          return new Response(JSON.stringify({ error: 'CNPJ inválido' }), { status: 400 })
        }

        const { data: fornecedor, error: err1 } = await supabaseClient
          .from('fornecedores')
          .insert({
            nome: body.nome,
            logo: body.logo || null,
            ativo: body.ativo !== false,
          })
          .select()
          .single()

        if (err1) throw err1

        if (body.cnpj_principal) {
          const { error: err2 } = await supabaseClient
            .from('fornecedor_cnpjs')
            .insert({
              fornecedor_id: fornecedor.id,
              cnpj: body.cnpj_principal,
              principal: true,
            })
          if (err2) throw err2
        }

        return new Response(JSON.stringify(fornecedor), { status: 201 })
      }

      case 'PATCH': {
        if (!supplierId) {
          return new Response(JSON.stringify({ error: 'ID do fornecedor é obrigatório' }), { status: 400 })
        }

        const body = await req.json()

        const { data: updated, error: err1 } = await supabaseClient
          .from('fornecedores')
          .update({
            nome: body.nome,
            logo: body.logo,
            ativo: body.ativo,
          })
          .eq('id', supplierId)
          .select()
          .single()

        if (err1) throw err1

        if (body.cnpj_principal && validateCNPJ(body.cnpj_principal)) {
          const { data: existing, error: err2 } = await supabaseClient
            .from('fornecedor_cnpjs')
            .select('id')
            .eq('fornecedor_id', supplierId)
            .eq('principal', true)
            .maybeSingle()

          if (err2) throw err2

          if (existing) {
            await supabaseClient
              .from('fornecedor_cnpjs')
              .update({
                cnpj: body.cnpj_principal,
                principal: true,
              })
              .eq('id', existing.id)
          } else {
            await supabaseClient
              .from('fornecedor_cnpjs')
              .insert({
                fornecedor_id: supplierId,
                cnpj: body.cnpj_principal,
                principal: true,
              })
          }
        }

        return new Response(JSON.stringify(updated), { status: 200 })
      }

      case 'DELETE':
        if (!supplierId) {
          return new Response(JSON.stringify({ error: 'ID é obrigatório' }), { status: 400 })
        }

        const { error: err3 } = await supabaseClient
          .from('fornecedores')
          .delete()
          .eq('id', supplierId)

        if (err3) throw err3

        return new Response(null, { status: 204 })

      default:
        return new Response(JSON.stringify({ error: 'Método não suportado' }), { status: 405 })
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
})
