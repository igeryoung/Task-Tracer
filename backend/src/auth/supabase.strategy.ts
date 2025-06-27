// src/auth/supabase.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
  private supabase: SupabaseClient;

  constructor(private config: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('SUPABASE_JWT_SECRET'),
    });

    const url = config.get<string>('SUPABASE_URL');
    const key = config.get<string>('SUPABASE_SERVICE_KEY');
    console.log('url', url);
    console.log('key', key);
    if (!url || !key) {
      throw new Error(
        'Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in your .env',
      );
    }
    this.supabase = createClient(url, key);
  }

  async validate(): Promise<{ id: string; email: string }> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error || !data.user) {
      throw new UnauthorizedException(error?.message ?? 'Invalid token');
    }
    return {
      id: data.user.id ?? 'defaultId',
      email: data.user.email ?? 'defaultEmail',
    };
  }
}
