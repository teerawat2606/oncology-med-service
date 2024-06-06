import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AllPatientDto } from './patient.dto';
import { PatientService } from './patient.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patient')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [AllPatientDto] })
  @Get()
  getAllRegimen(@Req() request: Request): Promise<AllPatientDto[]> {
    return this.patientService.getAll();
  }
}
