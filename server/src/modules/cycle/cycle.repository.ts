import { InjectRepository } from '@nestjs/typeorm';
import { Cycle } from 'src/entities/cycle.entity';
import { Repository } from 'typeorm';
import { CycleStatus } from 'src/enums';
import { DBAction } from 'src/entities/cycleLog.entity';
import { CycleLogRepository } from './cycleLog.repository';

export class CycleRepository extends Repository<Cycle> {
  constructor(
    private readonly cycleLogRepository: CycleLogRepository,
    @InjectRepository(Cycle)
    private cycleRepository: Repository<Cycle>,
  ) {
    super(
      cycleRepository.target,
      cycleRepository.manager,
      cycleRepository.queryRunner,
    );
  }

  async findAll(offset?: number, limit?: number): Promise<Cycle[]> {
    const skip = offset || 0;
    if (limit === -1) {
      return this.find({ skip });
    } else {
      return this.find({ skip, take: limit });
    }
  }

  async findShortByDoctor(doctorId: number): Promise<Cycle[]> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id', 'cycle.status'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .where('c.doctor_id = :doctorId', { doctorId })
      .andWhere('cycle.status = :status', { status: CycleStatus.OPEN })
      .getMany();
  }

  async findShortByStatus(statuses: CycleStatus[]): Promise<Cycle[]> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id', 'cycle.status'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .where('cycle.status IN (:...statuses)', { statuses })
      .getMany();
  }

  async findShortById(cycleId: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id', 'cycle.status'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .where('cycle.id = :cycleId', { cycleId })
      .getOne();
  }

  async findById(id: number): Promise<Cycle> {
    return this.findOne({
      where: { id },
      relations: ['cycleBottles', 'cycleFormulas'],
    });
  }

  async findDetailById(id: number): Promise<Cycle> {
    return this.findOne({
      where: { id },
      relations: [
        'cycleBottles',
        'cycleBottles.bottle',
        'cycleFormulas',
        'cycleFormulas.formula',
        'aCase',
        'aCase.patient',
        'aCase.doctor',
        'aCase.regimen',
      ],
    });
  }

  async findOneOpenCycle(id: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id', 'cycle.cycleNumber'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .leftJoinAndSelect('regimen.regimenFormulas', 'regimenFormulas')
      .leftJoinAndSelect('regimenFormulas.formula', 'formula')
      .leftJoinAndSelect('formula.drug', 'drug')
      .where('cycle.id = :id', { id })
      .getOne();
  }

  async findLatestCycle(caseId: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select([
        'cycle.id',
        'cycle.cycleNumber',
        'cycle.status',
        'c.totalCycles',
      ])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .where('case_id = :caseId', { caseId })
      .orderBy('cycle.cycleNumber', 'DESC')
      .getOne();
  }

  async insertOne(caseId: number, cycleNumber: number): Promise<Cycle> {
    const insertResult = await this.insert({
      caseId,
      cycleNumber,
    });

    if (insertResult.identifiers.length == 0) {
      throw new Error(`CycleRepository.insertOne: ${insertResult.raw}`);
    }

    // Insert a new cycle log entry
    await this.cycleLogRepository.insert({
      cycleId: insertResult.identifiers[0].id,
      status: CycleStatus.OPEN,
      action: DBAction.CREATE,
    });

    return this.findById(insertResult.identifiers[0].id);
  }

  async deleteById(id: number): Promise<void> {
    await this.delete(id);
  }

  async cascadeUpdateOneCycle(updatedCycle: Cycle): Promise<Cycle> {
    await this.cycleLogRepository.insert({
      cycleId: updatedCycle.id,
      status: updatedCycle.status,
      action: DBAction.UPDATE,
    });

    // cascade update to cycleFormulas
    return this.save(updatedCycle);
  }

  async findOnePharmacyCycle(cycleId: number): Promise<Cycle> {
    // returns cycle with formulas
    return this.cycleRepository
      .createQueryBuilder('cycle')
      .select(['cycle.id', 'drug.id', 'drug.name'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .leftJoinAndSelect('cycle.cycleFormulas', 'cycleFormulas')
      .leftJoinAndSelect('cycleFormulas.formula', 'formula')
      .leftJoinAndSelect('formula.drug', 'drug')
      .where('cycle.id = :cycleId', { cycleId })
      .getOne();
  }

  async findOneCheckCycle(cycleId: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select([
        'cycle.id',
        'cycle.cycleNumber',
        'cycle.preMedication',
        'cycle.regimenRemark',
        'cycle.regimenMedication',
        'cycle.regimenHomeMedication',
        'cycle.isInsurance',
        'drug.id',
        'drug.name',
      ])
      .leftJoinAndSelect('cycle.cycleFormulas', 'cycleFormulas')
      .leftJoinAndSelect('cycleFormulas.formula', 'formula')
      .leftJoinAndSelect('formula.drug', 'drug')
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .leftJoinAndSelect('cycle.cycleBottles', 'cycleBottles')
      .leftJoinAndSelect('cycleBottles.bottle', 'bottle')
      .where('cycle.id = :cycleId', { cycleId })
      .getOne();
  }

  async findOneCostSummary(cycleId: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select([
        'cycle.id',
        'cycle.WBCmedAddinfo',
        'cycle.WBCmedCost',
        'cycle.takehomeMedCost',
        'cycle.doctorEquipmentCost',
        'cycle.doctorExpertiseCost',
        'cycle.bloodTestCost',
        'cycle.premedCost',
        'cycle.cycleCost',
      ])
      .leftJoinAndSelect('cycle.cycleFormulas', 'cycleFormulas')
      .leftJoinAndSelect('cycle.cycleBottles', 'cycleBottles')
      .leftJoinAndSelect('cycleBottles.bottle', 'bottle')
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .where('cycle.id = :cycleId', { cycleId })
      .getOne();
  }

  async findOneForUsageSummary(cycleId: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id', 'drug.id', 'drug.name'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .leftJoinAndSelect('cycle.cycleFormulas', 'cycleFormulas')
      .leftJoinAndSelect('cycleFormulas.formula', 'formula')
      .leftJoinAndSelect('formula.drug', 'drug')
      .leftJoinAndSelect('cycle.cycleBottles', 'cycleBottles')
      .leftJoinAndSelect('cycleBottles.bottle', 'bottle')
      .where('cycle.id = :cycleId', { cycleId })
      .getOne();
  }

  async findOneAppointmentCycle(cycleId: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .where('cycle.id = :cycleId', { cycleId })
      .getOne();
  }

  async findOneInventoryCycle(cycleId: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id', 'drug.id', 'drug.name', 'cycle.pharmacyNote'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .leftJoinAndSelect('cycle.cycleFormulas', 'cycleFormulas')
      .leftJoinAndSelect('cycleFormulas.formula', 'formula')
      .leftJoinAndSelect('formula.drug', 'drug')
      .leftJoinAndSelect('cycle.cycleBottles', 'cycleBottles')
      .leftJoinAndSelect('cycleBottles.bottle', 'bottle')
      .where('cycle.id = :cycleId', { cycleId })
      .getOne();
  }

  async findOneDrugSummary(cycleId: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id', 'cycle.appointmentDate'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('cycle.cycleFormulas', 'cycleFormulas')
      .leftJoinAndSelect('cycle.cycleBottles', 'cycleBottles')
      .leftJoinAndSelect('cycleBottles.bottle', 'bottle')
      .where('cycle.id = :cycleId', { cycleId })
      .getOne();
  }

  async findOneReturnCycle(cycleId: number): Promise<Cycle> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id', 'drug.id', 'drug.name', 'cycle.pharmacyNote'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .leftJoinAndSelect('cycle.cycleFormulas', 'cycleFormulas')
      .leftJoinAndSelect('cycleFormulas.formula', 'formula')
      .leftJoinAndSelect('formula.drug', 'drug')
      .leftJoinAndSelect('cycle.cycleBottles', 'cycleBottles')
      .leftJoinAndSelect('cycleBottles.bottle', 'bottle')
      .where('cycle.id = :cycleId', { cycleId })
      .getOne();
  }

  async findAppointments(fromDate: string, toDate: string): Promise<Cycle[]> {
    return this.createQueryBuilder('cycle')
      .select(['cycle.id', 'cycle.appointmentDate'])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .leftJoinAndSelect('cycle.cycleBottles', 'cycleBottles')
      .leftJoinAndSelect('cycleBottles.bottle', 'bottle')
      .leftJoinAndSelect('cycle.cycleFormulas', 'cycleFormulas')
      .leftJoinAndSelect('cycleFormulas.formula', 'formula')
      .leftJoinAndSelect('formula.drug', 'drug')
      .where('cycle.appointmentDate BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .getMany();
  }

  async findByCaseId(caseId: number): Promise<Cycle[]> {
    return this.createQueryBuilder('cycle')
      .select([
        'cycle.id',
        'cycle.status',
        'cycle.cycleNumber',
        'cycle.appointmentDate',
      ])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .where('c.id = :caseId', { caseId })
      .getMany();
  }

  async findByMonth(month: number, year: number): Promise<Cycle[]> {
    return this.createQueryBuilder('cycle')
      .select([
        'cycle.id',
        'cycle.status',
        'cycle.cycleNumber',
        'cycle.appointmentDate',
      ])
      .leftJoinAndSelect('cycle.aCase', 'c')
      .leftJoinAndSelect('c.patient', 'patient')
      .leftJoinAndSelect('c.doctor', 'doctor')
      .leftJoinAndSelect('c.regimen', 'regimen')
      .where('MONTH(cycle.appointmentDate) = :month', { month })
      .andWhere('YEAR(cycle.appointmentDate) = :year', { year })
      .getMany();
  }

  async deleteOneCycle(cycleId: number): Promise<void> {
    // Insert a new cycle log entry
    await this.cycleLogRepository.insert({
      cycleId,
      status: CycleStatus.CLOSED,
      action: DBAction.DELETE,
    });

    await this.delete(cycleId);
  }
}
