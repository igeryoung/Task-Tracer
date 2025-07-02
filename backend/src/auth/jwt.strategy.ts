/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/auth/jwt.strategy.ts
// This strategy is used by Passport to validate the JWT from Supabase.

import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Use your Supabase JWT secret here. It's best to load this from environment variables.
      secretOrKey: process.env.SUPABASE_JWT_SECRET,
    });
  }

  // This method is called by Passport after it successfully validates the token's signature.
  // It allows us to do further validation, like checking if the user still exists.
  async validate(payload: any) {
    // The payload contains the decoded JWT claims (e.g., sub, aud, exp).
    // The 'sub' claim from Supabase is the user's UUID.
    if (!payload.sub) {
      throw new UnauthorizedException();
    }
    // We could add a check here to see if the user still exists in the DB,
    // but for Supabase, validating the token signature is usually sufficient.

    // The returned object will be attached to the `request.user` object.
    return { sub: payload.sub, email: payload.email };
  }
}
