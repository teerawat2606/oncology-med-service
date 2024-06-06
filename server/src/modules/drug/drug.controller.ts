import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { CreateDrugDto, DrugDto, DrugIdWithBottlesDto } from './drug.dto';
import { DrugService } from './drug.service';

@Controller('drug')
export class DrugController {
  constructor(private drugService: DrugService) {}

  @ApiOkResponse({ type: DrugDto })
  @Post()
  @HttpCode(201)
  create(@Body() createDrugDto: CreateDrugDto): Promise<DrugDto> {
    return this.drugService.createDrug(createDrugDto);
  }

  @ApiOkResponse({ type: DrugDto })
  @Delete('/:drugId')
  delete(@Param('drugId') drugId: number): Promise<DrugDto> {
    return this.drugService.deleteDrug(drugId);
  }

  @ApiOkResponse({ type: [DrugDto] })
  @Get()
  getAll(): Promise<DrugDto[]> {
    return this.drugService.findAll();
  }

  @ApiOkResponse({ type: String, isArray: true })
  @Get('name')
  getAllName(): Promise<string[]> {
    return this.drugService.getAllName();
  }

  @ApiResponse({ type: [DrugIdWithBottlesDto] })
  @Get('bottles')
  getManyDrugsWithBottles(
    @Query('drugIds') drugIds: string,
  ): Promise<DrugIdWithBottlesDto[]> {
    try {
      return this.drugService.getManyDrugsWithBottles(
        drugIds.split(',').map((drugId) => +drugId),
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
