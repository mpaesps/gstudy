# Banco De Dados

O banco de dados do Gstudy foi modelado para registrar usuários, alunos, tutores, escolas, turmas, tutorias, frequência, metas, planos de ação, Projeto de Vida, indicadores, alertas e relatórios.

## MER Textual

```text
School 1:N ClassGroup
ClassGroup 1:N Student
User 1:1 Student
User 1:1 Tutor
Tutor 1:N TutoringSession
TutoringSession N:N Student via SessionParticipant
TutoringSession 1:N Attendance
Student 1:N Goal
Goal 1:N ActionPlan
Student 1:1 LifeProject
Student 1:N Indicator
Student 1:N Alert
```

## Entidades Principais

- `User`: identidade, login, senha criptografada e perfil.
- `Student`: aluno vinculado a usuário e turma.
- `Tutor`: tutor vinculado a usuário.
- `TutoringSession`: atendimento pedagógico individual ou coletivo.
- `Attendance`: presença por aluno em cada tutoria.
- `Goal`: meta pedagógica.
- `LifeProject`: interesses, sonhos e próximos passos do estudante.
- `Indicator`: desempenho, participação, frequência, comportamento e metas.
- `Alert`: alertas pedagógicos automáticos.

## Integridade

- E-mail de usuário é único.
- Matrícula de aluno é única.
- Um usuário pode estar vinculado a um aluno ou tutor.
- Frequência é única por aluno em uma tutoria.
- Participante é único por aluno em uma tutoria.
