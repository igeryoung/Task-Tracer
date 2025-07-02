// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { SupabaseModule } from '../supabase/supabase.module';
import { SupabaseStrategy } from './supabase.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // Ensure environment variables are loaded
    ConfigModule.forRoot({ isGlobal: true, cache: true }),

    // Passport & JWT configuration
    PassportModule,
    JwtModule.register({
      secret: process.env.SUPABASE_JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),

    // Supabase client provider
    SupabaseModule,
  ],
  providers: [AuthService, SupabaseStrategy, JwtAuthGuard, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
