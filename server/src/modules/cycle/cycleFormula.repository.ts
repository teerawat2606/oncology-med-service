import { InjectRepository } from '@nestjs/typeorm';
import { CycleFormula } from 'src/entities/cycleFormula.entity';
import { Repository } from 'typeorm';
import { CycleFormulaKeys } from './cycle.dto';

export class CycleFormulaRepository extends Repository<CycleFormula> {
  constructor(
    @InjectRepository(CycleFormula)
    private cycleFormulaRepository: Repository<CycleFormula>,
  ) {
    super(
      cycleFormulaRepository.target,
      cycleFormulaRepository.manager,
      cycleFormulaRepository.queryRunner,
    );
  }

  async findManyByKeys(
    cycleFormulaKeys: CycleFormulaKeys[],
  ): Promise<CycleFormula[]> {
    return this.cycleFormulaRepository.findBy(cycleFormulaKeys);
  }
}
