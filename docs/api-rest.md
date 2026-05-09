# API REST

Todas as rotas usam o prefixo `/api`.

## Autenticacao

```text
POST /api/auth/login
GET  /api/auth/me
```

## Usuarios

```text
GET    /api/users
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
```

## Alunos

```text
GET /api/students
GET /api/students/:id
GET /api/students/:id/history
GET /api/students/:studentId/attendance
GET /api/students/:studentId/life-project
PUT /api/students/:studentId/life-project
```

## Tutorias

```text
POST /api/tutoring-sessions
GET  /api/tutoring-sessions
GET  /api/tutoring-sessions/:id
POST /api/tutoring-sessions/:id/complete
```

## Metas

```text
POST  /api/goals
GET   /api/students/:id/goals
PATCH /api/goals/:id
```

## Dashboards

```text
GET /api/dashboards/student/:id
GET /api/dashboards/tutor
GET /api/dashboards/coordinator
```

## Relatorios

```text
GET /api/reports/tutoring
GET /api/reports/attendance
GET /api/reports/students-without-followup
```
