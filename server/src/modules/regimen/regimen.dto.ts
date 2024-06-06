import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormulaUnit, Usage } from 'src/enums';

class Usages {
  @ApiProperty()
  usage: Usage;

  @ApiProperty({ type: () => [FormulaDto] })
  formulas: FormulaDto[];
}

class FormulaDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  drugId: number;

  @ApiProperty()
  formulaQuantity: number;

  @ApiProperty()
  maxFormulaQuantity?: number;

  @ApiProperty()
  formulaUnit: FormulaUnit;

  @ApiProperty()
  diluteDescription?: string;
}

export class CreateRegimenDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  remark?: string;

  @ApiPropertyOptional()
  medication?: string;

  @ApiPropertyOptional()
  premedication?: string;

  @ApiPropertyOptional()
  homeMed?: string;

  @ApiProperty()
  totalCycle: number;

  @ApiProperty({ type: () => [Usages] })
  usages: Usages[];
}

export class ShortRegimen {
  id: number;
  name: string;
  drug?: { name: string }[];
}

export class RegimenDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  note?: string;

  @ApiProperty()
  remark?: string;

  @ApiProperty()
  medication?: string;

  @ApiProperty()
  homeMed?: string;
}

class RegimenFormulaDto {
  @ApiProperty()
  regimenId: number;

  @ApiProperty()
  formulaId: number;

  @ApiProperty()
  usage: string;

  @ApiProperty({ type: () => FormulaDto })
  formulas: FormulaDto;
}

export class RegimenDetail {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  note?: string;

  @ApiProperty()
  remark?: string;

  @ApiProperty()
  medication?: string;

  @ApiProperty()
  homeMed?: string;

  @ApiProperty({ type: () => [RegimenFormulaDto] })
  regimenFormula: RegimenFormulaDto[];
}

export class RegimenNameNote {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  note?: string;
}
