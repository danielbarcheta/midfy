CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

DROP TABLE IF EXISTS public.segmentos CASCADE;
CREATE TABLE public.segmentos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  nome TEXT NOT NULL UNIQUE
);

DROP TABLE IF EXISTS public.fornecedores CASCADE;
CREATE TABLE public.fornecedores (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  nome TEXT NOT NULL UNIQUE,
  logo TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  data_cadastro TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS public.fornecedor_cnpjs CASCADE;
CREATE TABLE public.fornecedor_cnpjs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  fornecedor_id uuid NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  cnpj TEXT NOT NULL UNIQUE,
  principal BOOLEAN DEFAULT FALSE,
  CONSTRAINT cnpj_valido CHECK (
    cnpj ~ '^\d{14}$' OR 
    cnpj ~ '^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$'
  )
);

DROP TABLE IF EXISTS public.fornecedor_segmentos CASCADE;
CREATE TABLE public.fornecedor_segmentos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  fornecedor_id uuid NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  segmento_id uuid NOT NULL REFERENCES public.segmentos(id) ON DELETE CASCADE,
  CONSTRAINT fornecedor_segmento_unico UNIQUE (fornecedor_id, segmento_id)
);

CREATE INDEX idx_fornecedores_nome ON public.fornecedores USING gin (nome gin_trgm_ops);
CREATE INDEX idx_segmentos_nome ON public.segmentos USING gin (nome gin_trgm_ops);
CREATE INDEX idx_fornecedor_cnpjs_fornecedor ON public.fornecedor_cnpjs(fornecedor_id);
CREATE INDEX idx_fornecedor_segmentos_fornecedor ON public.fornecedor_segmentos(fornecedor_id);
CREATE INDEX idx_fornecedor_segmentos_segmento ON public.fornecedor_segmentos(segmento_id);
CREATE INDEX idx_fornecedor_cnpjs_cnpj ON public.fornecedor_cnpjs(cnpj);

CREATE OR REPLACE FUNCTION public.valida_cnpj(cnpj TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  cnpj_limpo TEXT;
  soma INTEGER;
  peso INTEGER;
  digito1 INTEGER;
  digito2 INTEGER;
  resto INTEGER;
BEGIN
  cnpj_limpo := regexp_replace(cnpj, '[^0-9]', '', 'g');
  IF length(cnpj_limpo) != 14 THEN RETURN FALSE; END IF;
  IF cnpj_limpo ~ '^(\d)\1+$' THEN RETURN FALSE; END IF;

  soma := 0;
  peso := 5;
  FOR i IN 1..12 LOOP
    soma := soma + (substring(cnpj_limpo, i, 1)::INTEGER * peso);
    peso := peso - 1;
    IF peso = 1 THEN peso := 9; END IF;
  END LOOP;

  resto := soma % 11;
  digito1 := CASE WHEN resto < 2 THEN 0 ELSE 11 - resto END;

  soma := 0;
  peso := 6;
  FOR i IN 1..13 LOOP
    soma := soma + (substring(cnpj_limpo, i, 1)::INTEGER * peso);
    peso := peso - 1;
    IF peso = 1 THEN peso := 9; END IF;
  END LOOP;

  resto := soma % 11;
  digito2 := CASE WHEN resto < 2 THEN 0 ELSE 11 - resto END;

  RETURN substring(cnpj_limpo, 13, 1)::INTEGER = digito1 AND 
         substring(cnpj_limpo, 14, 1)::INTEGER = digito2;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.verifica_cnpj_principal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.principal THEN
    UPDATE public.fornecedor_cnpjs 
    SET principal = FALSE 
    WHERE fornecedor_id = NEW.fornecedor_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cnpj_principal
AFTER INSERT OR UPDATE OF principal ON public.fornecedor_cnpjs
FOR EACH ROW EXECUTE FUNCTION public.verifica_cnpj_principal();

CREATE OR REPLACE FUNCTION public.trigger_valida_cnpj()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.valida_cnpj(NEW.cnpj) THEN
    RAISE EXCEPTION 'CNPJ inválido: %', NEW.cnpj;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER valida_cnpj_trigger
BEFORE INSERT OR UPDATE ON public.fornecedor_cnpjs
FOR EACH ROW EXECUTE FUNCTION public.trigger_valida_cnpj();

CREATE OR REPLACE VIEW public.fornecedores_completo AS
SELECT
  f.id,
  f.nome,
  f.logo,
  f.ativo,
  f.data_cadastro,
  (
    SELECT cnpj 
    FROM public.fornecedor_cnpjs 
    WHERE fornecedor_id = f.id AND principal = TRUE 
    LIMIT 1
  ) AS cnpj_principal,
  COALESCE(
    json_agg(DISTINCT jsonb_build_object('id', c.id, 'cnpj', c.cnpj, 'principal', c.principal)) 
    FILTER (WHERE c.id IS NOT NULL), 
    '[]'
  ) AS cnpjs,
  COALESCE(
    json_agg(DISTINCT jsonb_build_object('id', s.id, 'nome', s.nome)) 
    FILTER (WHERE s.id IS NOT NULL), 
    '[]'
  ) AS segmentos,
  (
    SELECT COUNT(*) 
    FROM public.fornecedor_cnpjs 
    WHERE fornecedor_id = f.id
  ) AS total_cnpjs
FROM 
  public.fornecedores f
LEFT JOIN 
  public.fornecedor_cnpjs c ON c.fornecedor_id = f.id
LEFT JOIN 
  public.fornecedor_segmentos fs ON fs.fornecedor_id = f.id
LEFT JOIN 
  public.segmentos s ON s.id = fs.segmento_id
GROUP BY 
  f.id;

CREATE OR REPLACE VIEW public.fornecedores_busca AS
SELECT
  f.id,
  f.nome,
  f.logo,
  fc.cnpj AS cnpj_principal
FROM 
  public.fornecedores f
JOIN
  (SELECT fornecedor_id, cnpj FROM public.fornecedor_cnpjs WHERE principal = TRUE) fc
  ON fc.fornecedor_id = f.id;


ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to fornecedores" ON public.fornecedores
FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.fornecedor_cnpjs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to fornecedor_cnpjs" ON public.fornecedor_cnpjs
FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.segmentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to segmentos" ON public.segmentos
FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.fornecedor_segmentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to fornecedor_segmentos" ON public.fornecedor_segmentos
FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.segmentos (nome) VALUES
  ('Alimentos'), ('Vestuário'), ('Eletrônicos'),
  ('Móveis'), ('Brinquedos'), ('Livros'), ('Cosméticos')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO public.fornecedores (nome, logo, ativo) VALUES
  ('Fornecedor A', null, true),
  ('Fornecedor B', null, true),
  ('Fornecedor C', null, true),
  ('Fornecedor D', null, true),
  ('Fornecedor E', null, true)
ON CONFLICT (nome) DO NOTHING;

INSERT INTO public.fornecedor_cnpjs (fornecedor_id, cnpj, principal)
SELECT id, '01615833000120', true FROM public.fornecedores WHERE nome = 'Fornecedor A'
ON CONFLICT DO NOTHING;

INSERT INTO public.fornecedor_cnpjs (fornecedor_id, cnpj, principal)
SELECT id, '02828446000134', true FROM public.fornecedores WHERE nome = 'Fornecedor B'
ON CONFLICT DO NOTHING;

INSERT INTO public.fornecedor_cnpjs (fornecedor_id, cnpj, principal)
SELECT id, '72610132000146', true FROM public.fornecedores WHERE nome = 'Fornecedor C'
ON CONFLICT DO NOTHING;

INSERT INTO public.fornecedor_cnpjs (fornecedor_id, cnpj, principal)
SELECT id, '01874354000128', true FROM public.fornecedores WHERE nome = 'Fornecedor D'
ON CONFLICT DO NOTHING;

INSERT INTO public.fornecedor_cnpjs (fornecedor_id, cnpj, principal)
SELECT id, '04220692000134', true FROM public.fornecedores WHERE nome = 'Fornecedor E'
ON CONFLICT DO NOTHING;

INSERT INTO public.fornecedor_segmentos (fornecedor_id, segmento_id)
SELECT f.id, s.id FROM public.fornecedores f, public.segmentos s
WHERE (f.nome, s.nome) IN (
  ('Fornecedor A', 'Alimentos'),
  ('Fornecedor B', 'Eletrônicos'),
  ('Fornecedor C', 'Vestuário'),
  ('Fornecedor D', 'Móveis'),
  ('Fornecedor E', 'Cosméticos')
)
ON CONFLICT (fornecedor_id, segmento_id) DO NOTHING;
