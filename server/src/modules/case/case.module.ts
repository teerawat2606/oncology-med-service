import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from 'src/entities/case.entity';
import { CaseController } from './case.controller';
import { CaseRepository } from './case.repository';
import { CaseService } from './case.service';
import { PatientModule } from '../patient/patient.module';
import { CycleModule } from '../cycle/cycle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case]),
    forwardRef(() => CycleModule),
    PatientModule,
  ],
  providers: [CaseService, CaseRepository],
  controllers: [CaseController],
  exports: [CaseService],
})
export class CaseModule {}
