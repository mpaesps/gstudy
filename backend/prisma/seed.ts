import { PrismaClient, Role, TutoringType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  const coordinator = await prisma.user.upsert({
    where: { email: 'coordenacao@gstudy.edu.br' },
    update: {},
    create: {
      name: 'Gabriel Rocha',
      email: 'coordenacao@gstudy.edu.br',
      passwordHash,
      role: Role.COORDINATOR,
    },
  });

  const tutorUser = await prisma.user.upsert({
    where: { email: 'rafael@gstudy.edu.br' },
    update: {},
    create: {
      name: 'Prof. Rafael',
      email: 'rafael@gstudy.edu.br',
      passwordHash,
      role: Role.TUTOR,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'ana@gstudy.edu.br' },
    update: {},
    create: {
      name: 'Ana Clara',
      email: 'ana@gstudy.edu.br',
      passwordHash,
      role: Role.STUDENT,
    },
  });

  const school = await prisma.school.upsert({
    where: { id: 'seed-school' },
    update: {},
    create: {
      id: 'seed-school',
      name: 'Escola Gstudy Modelo',
      city: 'Sao Paulo',
      state: 'SP',
    },
  });

  const classGroup = await prisma.classGroup.upsert({
    where: { id: 'seed-class' },
    update: {},
    create: {
      id: 'seed-class',
      name: '2o Ano A',
      year: 2026,
      schoolId: school.id,
    },
  });

  const tutor = await prisma.tutor.upsert({
    where: { userId: tutorUser.id },
    update: {},
    create: {
      userId: tutorUser.id,
      subject: 'Matematica',
    },
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      registration: 'GST-2026-001',
      classGroupId: classGroup.id,
    },
  });

  await prisma.lifeProject.upsert({
    where: { studentId: student.id },
    update: {},
    create: {
      studentId: student.id,
      interests: 'Tecnologia, leitura e projetos sociais',
      strengths: 'Organizacao e comunicacao',
      dreams: 'Ingressar em uma universidade publica',
      nextSteps: 'Manter rotina semanal de estudos e participar das tutorias',
    },
  });

  await prisma.goal.upsert({
    where: { id: 'seed-goal-math' },
    update: {},
    create: {
        id: 'seed-goal-math',
        studentId: student.id,
        title: 'Melhorar participacao em Matematica',
        description: 'Participar das atividades propostas e tirar duvidas semanalmente.',
        createdById: coordinator.id,
        dueDate: new Date('2026-05-20'),
    },
  });

  await prisma.goal.upsert({
    where: { id: 'seed-goal-study-plan' },
    update: {},
    create: {
        id: 'seed-goal-study-plan',
        studentId: student.id,
        title: 'Concluir plano de estudos semanal',
        description: 'Registrar tarefas concluidas ao final da semana.',
        createdById: tutorUser.id,
        dueDate: new Date('2026-05-15'),
    },
  });

  const session = await prisma.tutoringSession.upsert({
    where: { id: 'seed-session-math' },
    update: {},
    create: {
      id: 'seed-session-math',
      tutorId: tutor.id,
      type: TutoringType.INDIVIDUAL,
      title: 'Tutoria de acompanhamento em Matematica',
      description: 'Revisao de conteudos e definicao de plano de acao.',
      observations: 'Aluno demonstrou evolucao e maior seguranca nos exercicios.',
      scheduledAt: new Date('2026-05-08T14:00:00-03:00'),
      completedAt: new Date('2026-05-08T15:00:00-03:00'),
      status: 'COMPLETED',
      periodicity: 'Semanal',
      participants: {
        create: { studentId: student.id },
      },
    },
  });

  await prisma.attendance.upsert({
    where: { sessionId_studentId: { sessionId: session.id, studentId: student.id } },
    update: {},
    create: {
      sessionId: session.id,
      studentId: student.id,
      present: true,
    },
  });

  await prisma.indicator.upsert({
    where: { id: 'seed-indicator-2026-04' },
    update: {},
    create: {
        id: 'seed-indicator-2026-04',
        studentId: student.id,
        academicPerformance: 7.2,
        participation: 7.6,
        attendanceRate: 92,
        behaviorEvolution: 8.0,
        goalCompletion: 60,
        referenceMonth: new Date('2026-04-01'),
    },
  });

  await prisma.indicator.upsert({
    where: { id: 'seed-indicator-2026-05' },
    update: {},
    create: {
        id: 'seed-indicator-2026-05',
        studentId: student.id,
        academicPerformance: 8.4,
        participation: 8.6,
        attendanceRate: 96,
        behaviorEvolution: 8.8,
        goalCompletion: 75,
        referenceMonth: new Date('2026-05-01'),
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
