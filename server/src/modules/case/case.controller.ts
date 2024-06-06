import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { Case } from 'src/entities/case.entity';
import { CreateCaseDto, OpenCaseDto } from './case.dto';
import { CaseService } from './case.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('case')
export class CaseController {
  private logger = new Logger(CaseController.name);
  constructor(private readonly caseService: CaseService) {}

  @ApiCreatedResponse({ type: Case })
  @Post('new')
  async createCase(@Body() createCaseDto: CreateCaseDto): Promise<Case> {
    this.logger.verbose(`Creating a new case`);
    return this.caseService.createCase(createCaseDto);
  }

  // for doctor in select regimen page
  @ApiOkResponse({ type: OpenCaseDto })
  @Get('open/:caseId')
  getOpenCycle(@Param('cycleId') caseId: string): Promise<OpenCaseDto> {
    try {
      return this.caseService.getOpenCase(+caseId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
