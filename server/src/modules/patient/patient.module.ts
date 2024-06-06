import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/entities/patient.entity';
import { PatientController } from './patient.controller';
import { PatientRepository } from './patient.repository';
import { PatientService } from './patient.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  providers: [PatientService, PatientRepository],
  exports: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}
