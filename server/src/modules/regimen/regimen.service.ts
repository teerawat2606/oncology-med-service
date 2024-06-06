import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  CreateRegimenDto,
  RegimenDetail,
  RegimenDto,
  ShortRegimen,
} from './regimen.dto';
import { RegimenRepository } from './regimen.repository';

@Injectable()
export class RegimenService {
  private logger = new Logger(RegimenService.name);
  constructor(private readonly regimenRepository: RegimenRepository) {}

  async getAllShortRegimen(): Promise<ShortRegimen[]> {
    try {
      return this.regimenRepository.findAllShortRegimen();
    } catch (error) {
      this.logger.log(
        `RegimenService:getAllShortRegimen: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async getAllRegimenName(): Promise<ShortRegimen[]> {
    try {
      return this.regimenRepository.findAllRegimenName();
    } catch (error) {
      this.logger.log(
        `RegimenService:getAllRegimenName: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async getRegimenDetail(regimenId: number): Promise<RegimenDetail> {
    try {
      return this.regimenRepository.getRegimenDetailById(regimenId);
    } catch (error) {
      this.logger.log(
        `RegimenService:getRegimenDetail: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async createRegimen(regimenDto: CreateRegimenDto): Promise<RegimenDto> {
    try {
      return this.regimenRepository.insertOne(regimenDto);
    } catch (error) {
      this.logger.log(
        `RegimenService:createRegimen: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async deleteRegimen(regimenId: number): Promise<RegimenDto> {
    try {
      const regimen = await this.regimenRepository.findById(regimenId);
      if (!regimen) {
        throw new HttpException('Regimen not exists', HttpStatus.BAD_REQUEST);
      }
      await this.regimenRepository.deleteById(regimenId);
      return regimen;
    } catch (error) {
      this.logger.log(
        `RegimenService:deleteRegimen: ${JSON.stringify(error.message)}`,
      );
      throw new BadRequestException(error.message);
    }
  }
}
