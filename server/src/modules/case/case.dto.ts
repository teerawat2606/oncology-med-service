import { ApiProperty } from '@nestjs/swagger';
import { UpSertPatientDto } from '../patient/patient.dto';
import { Patient } from 'src/entities/patient.entity';

export class CreateCaseDto {
  @ApiProperty({ type: UpSertPatientDto })
  patient: UpSertPatientDto;

  @ApiProperty()
  doctorId: number;
}

export class OpenCaseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: Patient })
  patient: Patient;
}
