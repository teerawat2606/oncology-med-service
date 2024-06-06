import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBottleDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  cost: number;

  @ApiPropertyOptional()
  inventory: number;

  @ApiProperty()
  drugId: number;
}

export class BottleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  inventory: number;
}

export class BottleCostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cost: number;
}

export class BottleInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  inventory: number;
}

export class BottleInventoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  inventory: number;
}

export class BottleInventoryReservedDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  inventory: number;

  @ApiProperty()
  reserved: number;
}

export class EditBottleDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  cost?: number;

  @ApiPropertyOptional()
  inventory?: number;
}

export class BottleQuantityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity?: number;

  @ApiProperty()
  purchase?: number;
}

export class ObtainedBottle {
  @ApiProperty()
  id: number;

  @ApiProperty()
  requested: number;

  @ApiProperty()
  purchase: number;

  @ApiProperty()
  obtained: number;
}

export class SurplusBottle {
  @ApiProperty()
  id: number;

  @ApiProperty()
  surplus: number;
}
