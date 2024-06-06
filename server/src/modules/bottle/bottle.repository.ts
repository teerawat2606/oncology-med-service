import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bottle } from 'src/entities/bottle.entity';
import { DeepPartial, Repository } from 'typeorm';
import {
  BottleCostDto,
  BottleInventoryDto,
  BottleInventoryReservedDto,
  CreateBottleDto,
  EditBottleDto,
} from './bottle.dto';

export class BottleRepository extends Repository<Bottle> {
  constructor(
    @InjectRepository(Bottle)
    private bottleRepository: Repository<Bottle>,
  ) {
    super(
      bottleRepository.target,
      bottleRepository.manager,
      bottleRepository.queryRunner,
    );
  }

  async findAllWithPrice(): Promise<BottleCostDto[]> {
    const result = await this.createQueryBuilder('b')
      .select(['b.id', 'b.name', 'b.cost'])
      .getMany();
    return result as BottleCostDto[];
  }

  async findWithPrice(bottleIds: number[]): Promise<BottleCostDto[]> {
    return this.createQueryBuilder('b')
      .select(['b.id', 'b.name', 'b.cost'])
      .where('b.id IN (:...bottleIds)', { bottleIds })
      .getMany();
  }

  async findWithInventory(bottleIds: number[]): Promise<BottleInventoryDto[]> {
    if (!bottleIds.length) {
      return [];
    }
    return this.createQueryBuilder('b')
      .select(['b.id', 'b.inventory'])
      .where('b.id IN (:...bottleIds)', { bottleIds })
      .getMany();
  }

  async findAllWithinventory(): Promise<BottleInventoryReservedDto[]> {
    const result = await this.createQueryBuilder('b')
      .groupBy('b.name')
      .leftJoinAndSelect('b.cycleBottles', 'cb')
      .select(['b.id AS id', 'b.name AS name', 'b.inventory AS inventory'])
      .addSelect('SUM(cb.quantity)', 'reserved')
      .getRawMany();
    result.forEach((bottle) => (bottle.reserved = Number(bottle.reserved)));
    return result as BottleInventoryReservedDto[];
  }

  async findAll(offset?: number, limit?: number): Promise<Bottle[]> {
    const skip = offset || 0;
    if (limit === -1) {
      return this.find({ skip });
    } else {
      return this.find({ skip, take: limit });
    }
  }

  async findById(id: number): Promise<Bottle> {
    return this.findOneBy({ id });
  }

  async updateById(id: number, editBottleDto: EditBottleDto): Promise<any> {
    await this.update(id, editBottleDto);
    const result = this.findById(id);
    return result;
  }

  async updateMany(bottles: DeepPartial<Bottle>[]): Promise<Bottle[]> {
    return this.save(bottles);
  }

  async insertOne(createBottleDto: CreateBottleDto): Promise<Bottle> {
    const { name } = createBottleDto;
    const existingBottle = await this.findOne({
      where: { name },
    });
    if (existingBottle) {
      throw new HttpException('Bottle already exists', HttpStatus.BAD_REQUEST);
    }
    const bottle = this.create({
      ...createBottleDto,
      drug: { id: createBottleDto.drugId },
    });
    await this.save(bottle);

    return bottle;
  }

  async deleteById(id: number): Promise<void> {
    await this.delete(id);
  }
}
