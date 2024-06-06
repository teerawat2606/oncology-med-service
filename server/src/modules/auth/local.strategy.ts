import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<{ username: string; employeeId: string }> {
    const validatedUser = await this.authService.validateUser(
      username,
      password,
    );
    if (!validatedUser.username) {
      throw new UnauthorizedException('Username or password is incorrect.');
    }
    return validatedUser;
  }
}
