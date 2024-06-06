import { Repository } from 'typeorm';
import { Session } from 'src/entities/session.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SessionRepository extends Repository<Session> {
  constructor(
    @InjectRepository(Session)
    private readonly userRepository: Repository<Session>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }
}
