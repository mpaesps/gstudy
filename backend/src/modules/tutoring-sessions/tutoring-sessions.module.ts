import { Module } from '@nestjs/common';
import { TutoringSessionsController } from './tutoring-sessions.controller';
import { TutoringSessionsService } from './tutoring-sessions.service';

@Module({
  controllers: [TutoringSessionsController],
  providers: [TutoringSessionsService],
})
export class TutoringSessionsModule {}
