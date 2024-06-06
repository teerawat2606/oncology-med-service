import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Formula } from 'src/entities/formula.entity';
import { Regimen } from 'src/entities/regimen.entity';
import { RegimenFormula } from 'src/entities/regimenFormula.entity';
import { Repository } from 'typeorm';
import { CreateRegimenDto, RegimenDto, ShortRegimen } from './regimen.dto';

export class RegimenRepository extends Repository<Regimen> {
  constructor(
    @InjectRepository(Regimen)
    private regimenRepository: Repository<Regimen>,
    @InjectRepository(RegimenFormula)
    private regimenFormulaRepository: Repository<RegimenFormula>,
    @InjectRepository(Formula)
    private formulaRepository: Repository<Formula>,
  ) {
    super(
      regimenRepository.target,
      regimenRepository.manager,
      regimenRepository.queryRunner,
    );
  }

  async findAllShortRegimen(): Promise<ShortRegimen[]> {
    const payload = await this.createQueryBuilder('r')
      .select(['r.id', 'r.name', 'rf', 'f.id', 'd.name'])
      .leftJoin('r.regimenFormulas', 'rf')
      .leftJoin('rf.formula', 'f')
      .leftJoin('f.drug', 'd')
      .getMany();
    if (payload) {
      const result = payload.map((value) => ({
        id: value.id,
        name: value.name,
        drugs: value.regimenFormulas.map((x) => x.formula.drug.name),
      }));
      return result as ShortRegimen[];
    } else {
      throw new HttpException('There are no regimen', HttpStatus.BAD_REQUEST);
    }
  }

  async getRegimenDetailById(id: number): Promise<any> {
    const result = await this.createQueryBuilder('r')
      .leftJoinAndSelect('r.regimenFormulas', 'rf')
      .leftJoinAndSelect('rf.formula', 'f')
      .where('r.id = :id', { id })
      .getMany();
    // const result = await this.regimenFormulaRepository.find();
    return result;
  }

  async findAllRegimenName(): Promise<ShortRegimen[]> {
    const result = await this.createQueryBuilder('r')
      .select(['r.id', 'r.name'])
      .getMany();
    return result as ShortRegimen[];
  }

  async findAll(): Promise<Regimen[]> {
    return this.find();
  }

  async findById(id: number): Promise<Regimen> {
    return this.findOneBy({ id });
  }

  async insertOne(createRegimenDto: CreateRegimenDto): Promise<RegimenDto> {
    const { name, usages } = createRegimenDto;
    const existingRegimen = await this.findOne({
      where: { name },
    });
    if (existingRegimen) {
      throw new HttpException('Regimen already exists', HttpStatus.BAD_REQUEST);
    }
    const regimen = this.create(createRegimenDto);
    await this.save(regimen);
    await Promise.all(
      usages.map(async ({ usage, formulas }) => {
        await Promise.all(
          formulas.map(async (formulaDto) => {
            const formula = this.formulaRepository.create({
              ...formulaDto,
              drug: { id: formulaDto.drugId },
            });
            await this.formulaRepository.save(formula);
            const regimenFormula = this.regimenFormulaRepository.create({
              usage,
              regimen,
              formula,
            });
            await this.regimenFormulaRepository.save(regimenFormula);
          }),
        );
      }),
    );

    return regimen;
  }

  async deleteById(id: number): Promise<void> {
    await this.delete(id);
  }
}
