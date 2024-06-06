import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService, extractUserInfo } from '../user/user.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(username: string, done: CallableFunction): void {
    done(null, username);
  }

  async deserializeUser(
    username: string,
    done: CallableFunction,
  ): Promise<void> {
    try {
      const user = await this.userService.findByUsernameForAuth(username);
      done(null, extractUserInfo(user));
    } catch (error) {
      done(error);
    }
  }
}
