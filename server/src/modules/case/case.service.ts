import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateCaseDto, OpenCaseDto } from './case.dto';
import { Case } from 'src/entities/case.entity';
import { CaseRepository } from './case.repository';
import { PatientService } from '../patient/patient.service';
import { CycleService } from '../cycle/cycle.service';

@Injectable()
export class CaseService {
  private logger = new Logger(CaseService.name);
  constructor(
    @Inject(forwardRef(() => CycleService))
    private readonly cycleService: CycleService,
    private readonly caseRepository: CaseRepository,
    private readonly patientService: PatientService,
  ) {}

  async findById(caseId: number): Promise<Case> {
    try {
      return this.caseRepository.findById(caseId);
    } catch (error) {
      this.logger.error(`CaseService:findById ${error.message}`);
      throw error;
    }
  }

  async createCase(createCaseDto: CreateCaseDto): Promise<Case> {
    try {
      // create patient
      await this.patientService.upsertOnePatient(createCaseDto.patient);

      // create case
      const newCase = await this.caseRepository.insertOne(createCaseDto);

      // create first cycle
      await this.cycleService.createFirstCycle(newCase.id);

      return newCase;
    } catch (error) {
      this.logger.error(
        `CaseService:createCase: ${JSON.stringify(error.message)}`,
      );
      throw error;
    }
  }

  async getOpenCase(caseId: number): Promise<OpenCaseDto> {
    try {
      const openCase = await this.caseRepository.findOneOpenCase(caseId);

      // map to OpenCaseDto
      return {
        id: openCase.id,
        patient: openCase.patient,
      };
    } catch (error) {
      this.logger.error(`CaseService:getOneCase ${error.message}`);
      throw error;
    }
  }

  async updateOpenCase(
    caseId: number,
    totalCycles: number,
    regimenId: number,
  ): Promise<Case> {
    return this.caseRepository.updateRegimen(caseId, totalCycles, regimenId);
  }

  async deleteCase(caseId: number): Promise<void> {
    try {
      await this.caseRepository.deleteCase(caseId);
    } catch (error) {
      this.logger.error(`CaseService:deleteCase ${error.message}`);
      throw error;
    }
  }
}
