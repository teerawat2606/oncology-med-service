import { InjectRepository } from '@nestjs/typeorm';
import { CycleBottle } from 'src/entities/cycleBottle.entity';
import { Repository } from 'typeorm';
import { CycleBottleKeys } from './cycle.dto';

export class CycleBottleRepository extends Repository<CycleBottle> {
  constructor(
    @InjectRepository(CycleBottle)
    private cycleBottleRepository: Repository<CycleBottle>,
  ) {
    super(
      cycleBottleRepository.target,
      cycleBottleRepository.manager,
      cycleBottleRepository.queryRunner,
    );
  }

  async findManyByKeys(
    cycleBottleKeys: CycleBottleKeys[],
  ): Promise<CycleBottle[]> {
    return this.cycleBottleRepository.findBy(cycleBottleKeys);
  }

  async findManyByCycleId(cycleId: number): Promise<CycleBottle[]> {
    return this.find({ where: { cycleId }, relations: ['bottle'] });
  }
}
