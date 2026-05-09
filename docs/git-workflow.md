# Git E GitHub

## Branches

```text
main        -> versao estavel
develop     -> integracao
feature/*   -> novas funcionalidades
fix/*       -> correcoes
docs/*      -> documentacao
```

## Exemplos

```text
feature/auth-jwt
feature/student-dashboard
feature/tutoring-registration
feature/reports
docs/database-modeling
fix/attendance-validation
```

## Commits Semanticos

```text
feat: add jwt authentication
feat: create tutoring session module
feat: implement student dashboard
fix: validate individual tutoring participant limit
docs: add database modeling documentation
refactor: organize dashboard services
test: add tutoring session use case tests
chore: configure docker compose
```

## Pull Requests

Cada PR deve conter:

- O que foi feito.
- Como testar.
- Prints quando houver frontend.
- Regras de negócio afetadas.
- Checklist de validação.
