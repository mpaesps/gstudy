# Gstudy

Sistema web de gerenciamento de tutorias escolares desenvolvido como Projeto Integrador/TCC.

## Arquitetura

O projeto usa um monorepo com frontend e backend separados:

- `frontend`: Next.js, React, TypeScript e TailwindCSS.
- `backend`: NestJS, Node.js, TypeScript, Prisma e PostgreSQL.
- `docs`: documentação acadêmica e técnica do projeto.

```text
Usuario -> Frontend Next.js -> API REST NestJS -> Prisma ORM -> PostgreSQL
```

## Principais Funcionalidades

- Autenticação com JWT.
- Controle de permissões por perfil.
- Gestão de alunos, tutores, escolas e turmas.
- Registro de tutorias individuais e coletivas.
- Frequência, metas, planos de ação e Projeto de Vida.
- Dashboards para aluno, tutor e coordenação.
- Relatórios e alertas pedagógicos.

## Como Executar

### Com Docker

```powershell
docker compose up --build
```

Depois acesse:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3333/api
Banco:    localhost:5432
```

Para parar:

```powershell
docker compose down
```

### Com Node Portatil

Nesta maquina foi baixado um Node.js portatil em `tools/node-v24.15.0-win-x64`, porque o `npm` nao estava instalado no PATH.

Frontend:

```powershell
.\scripts\start-frontend.ps1
```

Backend:

```powershell
.\scripts\start-backend.ps1
```

Banco PostgreSQL portatil:

```powershell
.\scripts\start-postgres.ps1
```

Subir tudo de uma vez:

```powershell
.\scripts\start-all.ps1
```

### Com Node Instalado Globalmente

1. Configure o banco:

```bash
docker compose up -d
```

2. Configure o backend:

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

3. Configure o frontend:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Observacao Sobre Docker

O backend usa PostgreSQL. Se Docker Desktop nao estiver instalado, instale-o como administrador ou configure um PostgreSQL local e ajuste `backend/.env`.

Nesta maquina tambem foi configurado um PostgreSQL portatil em `tools/postgres`, sem depender de servico do Windows.

## Credenciais De Demonstração

```text
coordenacao@gstudy.edu.br / 123456
rafael@gstudy.edu.br / 123456
ana@gstudy.edu.br / 123456
```

## Perfis

- `STUDENT`: aluno.
- `TUTOR`: professor/tutor.
- `COORDINATOR`: coordenação/gestão.
- `ADMIN`: administração geral.

## Documentação

Consulte a pasta `docs/` para detalhes de arquitetura, banco de dados, regras de negócio, API REST e fluxo Git.
