// src/auth/jwt-auth.guard.ts
// This is the guard you requested. It uses the 'jwt' strategy we defined above.

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
