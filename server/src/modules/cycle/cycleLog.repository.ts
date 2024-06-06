import { InjectRepository } from '@nestjs/typeorm';
import { CycleLog } from 'src/entities/cycleLog.entity';
import { Repository } from 'typeorm';

export class CycleLogRepository extends Repository<CycleLog> {
  constructor(
    @InjectRepository(CycleLog)
    private cycleLogRepository: Repository<CycleLog>,
  ) {
    super(
      cycleLogRepository.target,
      cycleLogRepository.manager,
      cycleLogRepository.queryRunner,
    );
  }
}
