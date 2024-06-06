import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { LocalSerializer } from './local.serializer';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { JwtStrategy } from './jwt.strategy';

// @Module({
//   imports: [
//     UserModule,
//     PassportModule.register({ defaultStrategy: 'local', session: true }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, LocalStrategy, LocalSerializer, LocalAuthGuard],
// })

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    // PassportModule.register({ defaultStrategy: 'local', session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
