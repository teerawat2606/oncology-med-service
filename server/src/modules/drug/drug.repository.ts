import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Drug } from 'src/entities/drug.entity';
import { Repository } from 'typeorm';
import { CreateDrugDto, DrugDto } from './drug.dto';

export class DrugRepository extends Repository<Drug> {
  constructor(
    @InjectRepository(Drug)
    private drugRepository: Repository<Drug>,
  ) {
    super(
      drugRepository.target,
      drugRepository.manager,
      drugRepository.queryRunner,
    );
  }

  async findBottlesByDrugIds(drugIds: number[]): Promise<Drug[]> {
    return this.drugRepository
      .createQueryBuilder('d')
      .select(['d.id'])
      .leftJoinAndSelect('d.bottles', 'bottles')
      .where('d.id IN (:...drugIds)', { drugIds })
      .getMany();
  }

  async findAllName(): Promise<any[]> {
    const query = await this.createQueryBuilder('d')
      .select(['d.name'])
      .getMany();
    const result = query.map((x) => x.name);
    return result;
  }

  async findAll(limit?: number): Promise<DrugDto[]> {
    return this.find({ take: limit });
  }

  async findById(id: number): Promise<DrugDto> {
    return this.findOneBy({ id });
  }

  async insertOne(createDrugDto: CreateDrugDto): Promise<DrugDto> {
    const existingDrug = await this.findOne({
      where: { name: createDrugDto.name },
    });

    if (existingDrug) {
      throw new HttpException('Drug already exists', HttpStatus.BAD_REQUEST);
    }

    const insertResult = await this.insert(createDrugDto);

    if (insertResult.identifiers.length == 0) {
      throw new Error(`DrugRepository.insertOne: ${insertResult.raw}`);
    }
    return this.findById(insertResult.identifiers[0].id);
  }

  async deleteById(id: number): Promise<void> {
    await this.delete(id);
  }
}
