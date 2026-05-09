import { Module } from '@nestjs/common';
import { LifeProjectsController } from './life-projects.controller';
import { LifeProjectsService } from './life-projects.service';

@Module({
  controllers: [LifeProjectsController],
  providers: [LifeProjectsService],
})
export class LifeProjectsModule {}
