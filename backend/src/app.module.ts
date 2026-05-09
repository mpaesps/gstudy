import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TutorsModule } from './modules/tutors/tutors.module';
import { TutoringSessionsModule } from './modules/tutoring-sessions/tutoring-sessions.module';
import { GoalsModule } from './modules/goals/goals.module';
import { LifeProjectsModule } from './modules/life-projects/life-projects.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { DashboardsModule } from './modules/dashboards/dashboards.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { PrismaModule } from './database/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    TutorsModule,
    TutoringSessionsModule,
    GoalsModule,
    LifeProjectsModule,
    AttendanceModule,
    DashboardsModule,
    ReportsModule,
    AlertsModule,
  ],
})
export class AppModule {}
