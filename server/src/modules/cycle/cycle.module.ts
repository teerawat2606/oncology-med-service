import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cycle } from 'src/entities/cycle.entity';
import { CycleBottle } from 'src/entities/cycleBottle.entity';
import { CycleFormula } from 'src/entities/cycleFormula.entity';
import { BottleModule } from '../bottle/bottle.module';
import { DrugModule } from '../drug/drug.module';
import { PatientModule } from '../patient/patient.module';
import { CycleController } from './cycle.controller';
import { CycleRepository } from './cycle.repository';
import { CycleService } from './cycle.service';
import { CycleBottleRepository } from './cycleBottle.repository';
import { CycleFormulaRepository } from './cycleFormula.repository';
import { CaseModule } from '../case/case.module';
import { CycleLog } from 'src/entities/cycleLog.entity';
import { CycleLogRepository } from './cycleLog.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cycle, CycleBottle, CycleFormula, CycleLog]),
    DrugModule,
    PatientModule,
    BottleModule,
    forwardRef(() => CaseModule),
  ],
  providers: [
    CycleService,
    CycleRepository,
    CycleBottleRepository,
    CycleFormulaRepository,
    CycleLogRepository,
  ],
  controllers: [CycleController],
  exports: [CycleService],
})
export class CycleModule {}
