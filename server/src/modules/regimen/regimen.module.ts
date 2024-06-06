import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drug } from 'src/entities/drug.entity';
import { Formula } from 'src/entities/formula.entity';
import { Regimen } from 'src/entities/regimen.entity';
import { RegimenFormula } from 'src/entities/regimenFormula.entity';
import { RegimenController } from './regimen.controller';
import { RegimenRepository } from './regimen.repository';
import { RegimenService } from './regimen.service';

@Module({
  imports: [TypeOrmModule.forFeature([Regimen, RegimenFormula, Formula, Drug])],
  controllers: [RegimenController],
  providers: [RegimenService, RegimenRepository],
})
export class RegimenModule {}
