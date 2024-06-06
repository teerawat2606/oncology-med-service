import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Formula } from './formula.entity';
import { Regimen } from './regimen.entity';
import { Usage } from 'src/enums';

@Entity()
@Unique(['regimen', 'formula', 'usage'])
export class RegimenFormula {
  @ApiProperty()
  @PrimaryColumn({ name: 'regimen_id' })
  regimenId: number;

  @ApiProperty()
  @PrimaryColumn({ name: 'formula_id' })
  formulaId: number;

  @ApiPropertyOptional({ type: () => Regimen })
  @ManyToOne(() => Regimen, (regimen) => regimen.regimenFormulas, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'regimen_id' }])
  regimen?: Regimen;

  @ApiPropertyOptional({ type: () => Formula })
  @ManyToOne(() => Formula, (formula) => formula.regimenFormulas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'formula_id' }])
  formula?: Formula;

  @ApiProperty({ enum: Usage })
  @Column({ name: 'usage', type: 'varchar', length: 16 })
  usage: Usage;
}
