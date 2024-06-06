import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { CredentialDto, SignUpDto } from '../user/user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return this.authService.signUp(signUpDto);
  }

  // @ApiBody({ type: CredentialDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(@Req() request: Request): Promise<any> {
    const user = {
      username: (request.user as any)?.username ?? '',
      employeeId: (request.user as any)?.employeeId ?? '',
    };
    return this.authService.logIn(user);
  }

  @Get('logout')
  logOut(@Req() request: Request): any {
    return this.authService.logOut(request);
  }

  @Get('is-logged-in')
  isLoggedIn(@Req() request: Request): boolean {
    return Boolean(request.user);
  }
}
