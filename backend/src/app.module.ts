import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppointmentsModule } from './appointments/appointments.module';
import { TasksModule } from './tasks/tasks.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { TaskCompletionsModule } from './task-completions/task-completions.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    AppointmentsModule,
    TasksModule,
    ActivityLogsModule,
    TaskCompletionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
