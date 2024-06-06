import {
  ConflictException,
  HttpStatus,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CredentialDto, SignUpDto } from '../user/user.dto';
import * as argon2 from 'argon2';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string; employeeId: string }> {
    const userCredential: CredentialDto =
      await this.userService.findOneForSignIn(username);
    console.log('userCredential', userCredential);
    if (
      userCredential &&
      (await argon2.verify(userCredential.password, password))
    ) {
      console.log('validateUser', true);
      return {
        username: userCredential.username,
        employeeId: userCredential.employeeId,
      };
    }
    return null;
  }

  async signUp(userDto: SignUpDto): Promise<any> {
    userDto.password = await argon2.hash(userDto.password);

    const insertResult = await this.userService.create(userDto);
    if (!insertResult) throw new ConflictException('Username already exists');

    return { message: 'Sign up successful', statusCode: HttpStatus.CREATED };
  }

  logIn(user: { username: string; employeeId: string }): any {
    const payload = {
      username: user.username,
      employeeId: user.employeeId,
    };
    return {
      message: 'Log in successful',
      statusCode: HttpStatus.OK,
      access_token: this.jwtService.sign(payload),
    };
  }

  logOut(@Req() request: Request): any {
    if (request.isUnauthenticated())
      throw new UnauthorizedException(
        'Cannot logout because user not logged in.',
      );

    request.session.destroy(() => undefined);
    return { message: 'Log out successful', statusCode: HttpStatus.OK };
  }
}
