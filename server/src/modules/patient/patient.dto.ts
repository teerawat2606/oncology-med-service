import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/enums';

export class UpSertPatientDto {
  @ApiProperty()
  HN: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ enum: Gender })
  gender?: Gender;

  @ApiProperty()
  age: number;

  @ApiProperty()
  BW: number;

  @ApiProperty()
  Ht: number;

  @ApiProperty()
  sCr: number;
}

export class CalculatedPatientDto extends UpSertPatientDto {
  @ApiProperty()
  BSA: number;

  @ApiProperty()
  ClCrM: number;

  @ApiProperty()
  ClCrF: number;
}

export class ShortPatientDto {
  @ApiProperty()
  HN: number;

  @ApiProperty()
  name: string;
}

export class AllPatientDto {
  @ApiProperty()
  HN: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [AllPatientCaseDto] })
  cases: AllPatientCaseDto[];
}

class AllPatientCaseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  regimenName: string;

  @ApiProperty()
  doctorName: string;
}
