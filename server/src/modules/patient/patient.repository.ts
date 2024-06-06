import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/entities/patient.entity';
import { Repository } from 'typeorm';
import { AllPatientDto, UpSertPatientDto } from './patient.dto';

@Injectable()
export class PatientRepository extends Repository<Patient> {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {
    super(
      patientRepository.target,
      patientRepository.manager,
      patientRepository.queryRunner,
    );
  }

  async insertOne(patientDto: UpSertPatientDto): Promise<Patient> {
    const insertResult = await this.insert(patientDto);

    if (insertResult.identifiers.length == 0) {
      throw new Error(`PatientRepository.insertOne: ${insertResult.raw}`);
    }

    return this.findByHN(insertResult[0]);
  }

  async findByHN(HN: number): Promise<Patient> {
    return this.findOneBy({ HN });
  }

  async updateOne(patientDto: UpSertPatientDto): Promise<Patient> {
    await this.createQueryBuilder('p')
      .update()
      .set(patientDto)
      .where('HN = :HN', { HN: patientDto.HN })
      .execute();

    return this.findByHN(patientDto.HN);
  }

  async findAll(): Promise<AllPatientDto[]> {
    const payload = await this.createQueryBuilder('p')
      .select(['p.HN', 'p.name', 'c.id', 'r.name', 'd.name'])
      .leftJoin('p.cases', 'c')
      .leftJoin('c.regimen', 'r')
      .leftJoin('c.doctor', 'd')
      .getMany();
    return payload.map((patient) => ({
      HN: patient.HN,
      name: patient.name,
      cases: patient.cases.map((aCase) => ({
        id: aCase.id,
        regimenName: aCase.regimen ? aCase.regimen.name : null,
        doctorName: aCase.doctor.name,
      })),
    }));
  }
}
