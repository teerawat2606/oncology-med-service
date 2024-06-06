import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { Bottle } from 'src/entities/bottle.entity';
import {
  BottleCostDto,
  BottleDto,
  BottleInventoryReservedDto,
  CreateBottleDto,
  EditBottleDto,
} from './bottle.dto';
import { BottleService } from './bottle.service';

@Controller('bottle')
export class BottleController {
  constructor(private bottleService: BottleService) {}

  @ApiOkResponse({ type: Bottle })
  @ApiBadRequestResponse({
    description: 'return 400 if bottle already existed',
  })
  @Post()
  create(@Body() createBottleDto: CreateBottleDto): Promise<Bottle> {
    return this.bottleService.createBottle(createBottleDto);
  }

  @ApiOkResponse({ type: BottleDto })
  @Delete('/:bottleId')
  delete(@Param('bottleId') bottleId: number): Promise<BottleDto> {
    return this.bottleService.deleteBottle(bottleId);
  }

  @Get('cost')
  getWithCost(
    @Query('bottleIds') bottleIds?: string,
  ): Promise<BottleCostDto[]> {
    return this.bottleService.getBottleWithCost(
      bottleIds ? bottleIds.split(',').map((bottleId) => +bottleId) : null,
    );
  }

  @ApiOkResponse({ type: [BottleInventoryReservedDto] })
  @Get('inventory')
  getAllWithInventory(): Promise<BottleInventoryReservedDto[]> {
    return this.bottleService.getBottleInventory();
  }

  @ApiOkResponse({ type: Bottle })
  @Patch(':bottleId')
  editBottle(
    @Param('bottleId') bottleId: number,
    @Body() editBottleDto: EditBottleDto,
  ): Promise<Bottle> {
    return this.bottleService.editBottle(bottleId, editBottleDto);
  }
}
