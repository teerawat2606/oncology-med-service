import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateDrugDto, DrugDto, DrugIdWithBottlesDto } from './drug.dto';
import { DrugRepository } from './drug.repository';

@Injectable()
export class DrugService {
  private logger = new Logger(DrugService.name);
  constructor(private readonly drugRepository: DrugRepository) {}

  async findAll(limit?: number): Promise<DrugDto[]> {
    try {
      return this.drugRepository.findAll(limit);
    } catch (error) {
      this.logger.error(`DrugService:findAll ${error.message}`);
      throw error;
    }
  }

  async getManyDrugsWithBottles(
    drugIds: number[],
  ): Promise<DrugIdWithBottlesDto[]> {
    try {
      return this.drugRepository.findBottlesByDrugIds(drugIds);
    } catch (error) {
      this.logger.error(`DrugService:getBottlesByDrugId ${error.message}`);
      throw error;
    }
  }

  async createDrug(createDrugDto: CreateDrugDto): Promise<DrugDto> {
    try {
      return this.drugRepository.insertOne(createDrugDto);
    } catch (error) {
      this.logger.log(
        `RegimenService:createRegimen: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async deleteDrug(drugId: number): Promise<DrugDto> {
    try {
      const drug = await this.drugRepository.findById(drugId);
      if (!drug) {
        throw new HttpException('Drug not exists', HttpStatus.BAD_REQUEST);
      }
      await this.drugRepository.deleteById(drugId);
      return drug;
    } catch (error) {
      this.logger.log(
        `DrugService:deleteDrug: ${JSON.stringify(error.message)}`,
      );
      throw new BadRequestException(error.message);
    }
  }

  async getAllName(): Promise<any[]> {
    try {
      return this.drugRepository.findAllName();
    } catch (error) {
      this.logger.log(
        `RegimenService:createRegimen: ${JSON.stringify(error.message)}`,
      );
    }
  }
}
