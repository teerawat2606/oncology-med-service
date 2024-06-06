import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Bottle } from 'src/entities/bottle.entity';
import {
  BottleCostDto,
  BottleDto,
  BottleInventoryDto,
  BottleInventoryReservedDto,
  BottleQuantityDto,
  CreateBottleDto,
  EditBottleDto,
  ObtainedBottle,
  SurplusBottle,
} from './bottle.dto';
import { BottleRepository } from './bottle.repository';

@Injectable()
export class BottleService {
  private logger = new Logger(BottleService.name);
  constructor(private readonly bottleRepository: BottleRepository) {}

  async findAll(offset?: number, limit?: number): Promise<Bottle[]> {
    try {
      return this.bottleRepository.findAll(offset, limit);
    } catch (error) {
      this.logger.log(
        `BottleService:findAll: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async createBottle(createBottleDto: CreateBottleDto): Promise<Bottle> {
    try {
      const result = await this.bottleRepository.insertOne(createBottleDto);
      return result;
    } catch (error) {
      this.logger.log(
        `BottleService:createRegimen: ${JSON.stringify(error.message)}`,
      );
      throw new BadRequestException('bottle already exist');
    }
  }

  async deleteBottle(drugId: number): Promise<BottleDto> {
    try {
      const drug = await this.bottleRepository.findById(drugId);
      if (!drug) {
        throw new HttpException('Bottle not exists', HttpStatus.BAD_REQUEST);
      }
      await this.bottleRepository.deleteById(drugId);
      return drug;
    } catch (error) {
      this.logger.log(
        `BottleService:deleteBottle: ${JSON.stringify(error.message)}`,
      );
      throw new BadRequestException(error.message);
    }
  }

  async getBottleWithCost(bottleIds?: number[]): Promise<BottleCostDto[]> {
    try {
      if (bottleIds) {
        return this.bottleRepository.findByIds(bottleIds);
      }
      return this.bottleRepository.findAllWithPrice();
    } catch (error) {
      this.logger.log(
        `BottleService:getBottlePrice: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async getBottleInventory(): Promise<BottleInventoryReservedDto[]> {
    try {
      return this.bottleRepository.findAllWithinventory();
    } catch (error) {
      this.logger.log(
        `BottleService:getBottleInventory: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async getBottleInventoryByIds(
    bottleIds: number[],
  ): Promise<BottleInventoryDto[]> {
    try {
      return this.bottleRepository.findWithInventory(bottleIds);
    } catch (error) {
      this.logger.log(
        `BottleService:getBottleInventory: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async editBottle(
    bottleId: number,
    editBottleDto: EditBottleDto,
  ): Promise<Bottle> {
    try {
      return this.bottleRepository.updateById(bottleId, editBottleDto);
    } catch (error) {
      this.logger.log(
        `BottleService:editBottle: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async useBottles(
    bottleRequests: BottleQuantityDto[],
  ): Promise<ObtainedBottle[]> {
    // check that all bottles contain quantity and purchase
    const isBottleInvalid = bottleRequests.every(
      (b) => b.quantity !== undefined && b.purchase !== undefined,
    );
    if (!isBottleInvalid) {
      throw new BadRequestException('Invalid bottle request');
    }

    try {
      const bottlesWithInventory =
        await this.bottleRepository.findWithInventory(
          bottleRequests.map((b) => b.id),
        );

      // reduce inventory
      const obtainedBottles: ObtainedBottle[] = [];
      const reducedBottles = bottlesWithInventory.map((bottle) => {
        const bottleRequest = bottleRequests.find((b) => b.id === bottle.id);

        // if inventory is less than requested, obtain all available, else obtain requested
        let obtained: number;
        if (bottle.inventory < bottleRequest.quantity) {
          if (
            bottle.inventory + bottleRequest.purchase <
            bottleRequest.quantity
          ) {
            throw new BadRequestException('Not enough bottles');
          }

          obtained = bottle.inventory;
          bottle.inventory = 0;
        } else {
          obtained = bottleRequest.quantity;
          bottle.inventory -= bottleRequest.quantity;
        }
        obtainedBottles.push({
          id: bottleRequest.id,
          requested: bottleRequest.quantity,
          purchase: bottleRequest.purchase,
          obtained,
        });

        return bottle;
      });

      await this.bottleRepository.save(reducedBottles);

      return obtainedBottles;
    } catch (error) {
      this.logger.log(
        `BottleService:useBottles: ${JSON.stringify(error.message)}`,
      );
    }
  }

  async addInventory(surplusBottles: SurplusBottle[]) {
    const existingBottles = await this.bottleRepository.findWithInventory(
      surplusBottles.map((b) => b.id),
    );

    await this.bottleRepository.updateMany(
      existingBottles.map((bottle) => {
        const surplusBottle = surplusBottles.find((b) => b.id === bottle.id);

        bottle.inventory += surplusBottle.surplus;

        return bottle;
      }),
    );
  }
}
