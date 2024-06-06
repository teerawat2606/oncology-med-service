import { InjectRepository } from '@nestjs/typeorm';
import { Case } from 'src/entities/case.entity';
import { Repository } from 'typeorm';
import { CreateCaseDto } from './case.dto';

export class CaseRepository extends Repository<Case> {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
  ) {
    super(
      caseRepository.target,
      caseRepository.manager,
      caseRepository.queryRunner,
    );
  }

  async findById(id: number): Promise<Case> {
    return this.findOne({ where: { id }, relations: ['patient'] });
  }

  async insertOne(createCaseDto: CreateCaseDto): Promise<Case> {
    const insertResult = await this.insert({
      patient: { HN: createCaseDto.patient.HN },
      doctor: { id: createCaseDto.doctorId },
    });

    if (insertResult.identifiers.length == 0) {
      throw new Error(`CaseRepository.insertOne: ${insertResult.raw}`);
    }

    return this.findById(insertResult.identifiers[0].id);
  }

  async findOneOpenCase(id: number): Promise<Case> {
    return this.createQueryBuilder('c')
      .select(['c.id'])
      .leftJoinAndSelect('c.patient', 'patient')
      .where('c.id = :id', { id })
      .getOne();
  }

  async updateRegimen(
    caseId: number,
    totalCycles: number,
    regimenId: number,
  ): Promise<Case> {
    await this.createQueryBuilder('c')
      .update()
      .set({ regimen: { id: regimenId }, totalCycles })
      .where('id = :caseId', { caseId })
      .execute();

    return this.findById(caseId);
  }

  async deleteCase(id: number): Promise<void> {
    await this.delete(id);
  }
}
