import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), AppointmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
