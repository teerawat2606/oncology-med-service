import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormulaUnit } from 'src/enums';
import { BottleInfoDto } from '../bottle/bottle.dto';

export class CreateDrugDto {
  @ApiProperty()
  name: string;
}

export class DrugDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class GetDrugsDto {
  @ApiProperty()
  drugIds: number[];
}

export class DrugInfo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  formulaQuantity: number;

  @ApiProperty({ enum: FormulaUnit })
  formulaUnit: FormulaUnit;

  @ApiProperty()
  note?: string;
}

export class DrugWithQuantity {
  @ApiProperty({ type: DrugInfo })
  drug: DrugInfo;

  @ApiProperty()
  quantity: number;
}

export class ShortDrugDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class DrugIdWithBottlesDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional({ type: [BottleInfoDto] })
  bottles?: BottleInfoDto[];
}
