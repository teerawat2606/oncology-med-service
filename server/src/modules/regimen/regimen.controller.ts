import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import {
  CreateRegimenDto,
  RegimenDetail,
  RegimenDto,
  ShortRegimen,
} from './regimen.dto';
import { RegimenService } from './regimen.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('regimen')
export class RegimenController {
  constructor(private regimenService: RegimenService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [ShortRegimen] })
  @Get('')
  getAllRegimen(@Req() request: Request): Promise<ShortRegimen[]> {
    return this.regimenService.getAllShortRegimen();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: RegimenDto })
  @Delete('/:regimenId')
  delete(@Param('regimenId') regimenId: number): Promise<RegimenDto> {
    return this.regimenService.deleteRegimen(regimenId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [ShortRegimen] })
  @Get('name')
  getAllRegimenName(@Req() request: Request): Promise<ShortRegimen[]> {
    return this.regimenService.getAllRegimenName();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: RegimenDetail })
  @Get(':regimenId')
  getRegimenDetail(
    @Param('regimenId') regimenId: string,
    @Req() request: Request,
  ): Promise<RegimenDetail> {
    return this.regimenService.getRegimenDetail(Number(regimenId));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: RegimenDto })
  @Post()
  @HttpCode(201)
  create(@Body() regimenDto: CreateRegimenDto): Promise<RegimenDto> {
    return this.regimenService.createRegimen(regimenDto);
  }
}
