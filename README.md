#  Sistema de Fornecedores com React + Supabase

Este projeto é uma aplicação React com backend usando [Supabase](https://supabase.com/), responsável por cadastrar e gerenciar **fornecedores**, seus **CNPJs** e os **segmentos** em que atuam.

## 🏗️ Tecnologias Utilizadas

- React
- Supabase (PostgreSQL, Edge Functions, Policies)
- Deno (Edge Functions com Supabase)

---

##  Instalação


### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

### 2. Instale as dependências
npm install

### 3. Inicialize a aplicacao
npm start

## SUPABASE

## Credenciais
Crie um projeto Supabase e atualize as credenciais no arquivo .env

### Suba a estrutura SQL no Supabase
O SQL de estrutura da base está disponível em:

supabase/schema.sql

### Suba a Edge Funciton  
Suba a edge function localizada em supabase/functions/manage-fornecedor/index.ts
ou então publique-a usando o comando supabase functions deploy manage-fornecedor

