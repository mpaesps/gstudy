import { Metric, SessionRow } from '@/types/domain';

export const metrics: Metric[] = [
  { label: 'Tutorias realizadas', value: '42', change: '+12%', tone: 'blue' },
  { label: 'Frequencia media', value: '94,8%', change: '+3%', tone: 'green' },
  { label: 'Metas pendentes', value: '18', change: '-5%', tone: 'orange' },
  { label: 'Alunos em alerta', value: '7', change: '+2', tone: 'red' },
];

export const studentMetrics: Metric[] = [
  { label: 'Frequencia', value: '96%', change: '+4%', tone: 'green' },
  { label: 'Metas abertas', value: '3', change: '1 vence hoje', tone: 'orange' },
  { label: 'Evolucao', value: '8.4', change: '+0.6', tone: 'blue' },
  { label: 'Tutorias', value: '12', change: '2 agendadas', tone: 'blue' },
];

export const chartData = [
  { month: 'Jan', desempenho: 6.8, participacao: 7.1 },
  { month: 'Fev', desempenho: 7.2, participacao: 7.3 },
  { month: 'Mar', desempenho: 7.0, participacao: 7.8 },
  { month: 'Abr', desempenho: 7.8, participacao: 8.2 },
  { month: 'Mai', desempenho: 8.4, participacao: 8.6 },
];

export const sessions: SessionRow[] = [
  { student: 'Ana Clara', tutor: 'Prof. Rafael', type: 'Individual', status: 'Concluida', date: '08/05/2026' },
  { student: 'Bruno Lima', tutor: 'Prof. Marina', type: 'Coletiva', status: 'Agendada', date: '09/05/2026' },
  { student: 'Carla Souza', tutor: 'Prof. Rafael', type: 'Individual', status: 'Pendente', date: '10/05/2026' },
  { student: 'Diego Alves', tutor: 'Prof. Aline', type: 'Coletiva', status: 'Alerta', date: '12/05/2026' },
];

export const goals = [
  { title: 'Melhorar participacao em Matematica', status: 'Em andamento', due: '20/05/2026' },
  { title: 'Concluir plano de estudos semanal', status: 'Aberta', due: '15/05/2026' },
  { title: 'Registrar Projeto de Vida', status: 'Concluida', due: '02/05/2026' },
];
