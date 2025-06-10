#  Sistema de Fornecedores com React + Supabase

Este projeto é uma aplicação React com backend usando [Supabase](https://supabase.com/), responsável por cadastrar e gerenciar **fornecedores**, seus **CNPJs** e os **segmentos** em que atuam.

![76F7913E-9DDF-4CBE-A08C-C4EBEF62F6BD_4_5005_c](https://github.com/user-attachments/assets/b2ab2ff5-7ea8-4c2c-b18e-efae70c8768c)


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

## 3. SUPABASE

## Credenciais
Crie um projeto Supabase.
Na raiz do projeto, crie um arquivo .env e atualize as credenciais seguindo o exemplo em .env.example:
VITE_SUPABASE_URL=<your-supabase-url-here>
VITE_SUPABASE_ANON_KEY=<your-anon-key-here>

### Suba a estrutura SQL no Supabase
O SQL de estrutura da base está disponível em:

supabase/schema.sql

### Suba a Edge Funciton  
Suba a edge function localizada em supabase/functions/manage-fornecedor/index.ts
ou então publique-a usando o comando supabase functions deploy manage-fornecedor

### 4. Inicialize a aplicacao
npm start
