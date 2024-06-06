import { Module } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionRepository],
  exports: [SessionRepository],
})
export class SessionModule {}
