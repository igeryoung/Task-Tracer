// src/auth/auth.service.ts
import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { SupabaseClient } from '@supabase/supabase-js';
import { AuthError } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async signIn(email: string, password: string) {
    try {
      const {
        data,
        error,
      }: { data: { user: any } | null; error: AuthError | null } =
        await this.supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (/not confirmed/i.test(error.message)) {
          throw new BadRequestException('帳號尚未驗證，請先驗證 Email');
        }
        if (/invalid login credentials/i.test(error.message)) {
          throw new UnauthorizedException('帳號或密碼錯誤');
        }
        throw new BadRequestException(error.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const payload = { sub: data.user?.id, email: data.user?.email };
      return {
        access_token: this.jwtService.sign(payload),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: data.user?.id,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(err.message);
    }
  }

  async emailExists(email: string): Promise<boolean> {
    const {
      data: { users },
      error,
    } = await this.supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
    if (error) throw new InternalServerErrorException('檢查帳號是否存在失敗');
    return users.some((u) => u.email === email);
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      const exists = await this.emailExists(email);
      if (exists) {
        throw new BadRequestException('帳號已被註冊');
      }

      // 2. Call Supabase signUp API
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data,
        error,
      }: { data: { user: any } | null; error: AuthError | null } =
        await this.supabase.auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName, last_name: lastName } },
        });

      if (error) {
        if (/invalid email address/i.test(error.message)) {
          throw new BadRequestException('Email 格式錯誤');
        }
        throw new BadRequestException(error.message);
      }

      // 3. Return success message
      return { message: '註冊成功，請檢查您的信箱' };
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(err.message);
    }
  }
}
