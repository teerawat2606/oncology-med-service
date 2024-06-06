import { Injectable, Logger } from '@nestjs/common';
import { Patient } from 'src/entities/patient.entity';
import {
  AllPatientDto,
  CalculatedPatientDto,
  UpSertPatientDto,
} from './patient.dto';
import { PatientRepository } from './patient.repository';

const calculatedMeasures = (
  patientDto: UpSertPatientDto,
): CalculatedPatientDto => {
  const BSA = ((patientDto.BW * patientDto.Ht) / 3600) ** 0.5;
  const ClCrM =
    ((140 - patientDto.age) * patientDto.BW) / (patientDto.sCr * 72);
  const ClCrF = ClCrM * 0.85;

  return {
    ...patientDto,
    BSA,
    ClCrM,
    ClCrF,
  };
};

@Injectable()
export class PatientService {
  private logger = new Logger(PatientService.name);
  constructor(private readonly patientRepository: PatientRepository) {}

  async upsertOnePatient(patientDto: UpSertPatientDto): Promise<Patient> {
    try {
      const oldPatient = await this.patientRepository.findByHN(patientDto.HN);

      if (oldPatient)
        return this.patientRepository.updateOne(calculatedMeasures(patientDto));

      return this.patientRepository.insertOne(calculatedMeasures(patientDto));
    } catch (error) {
      this.logger.error(
        `PatientService:createOnePatient: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async getAll(): Promise<AllPatientDto[]> {
    try {
      return this.patientRepository.findAll();
    } catch (error) {
      this.logger.log(
        `RegimenService:getAllRegimenName: ${JSON.stringify(error.message)}`,
      );
    }
  }
}
