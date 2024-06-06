import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Cycle } from './cycle.entity';
import { Formula } from './formula.entity';
import { Usage } from 'src/enums';

@Entity()
@Unique(['cycle', 'formula', 'usage'])
export class CycleFormula {
  @ApiProperty()
  @PrimaryColumn({ name: 'cycle_id' })
  cycleId: number;

  @ApiProperty()
  @PrimaryColumn({ name: 'formula_id' })
  formulaId: number;

  @ApiPropertyOptional({ type: () => Cycle })
  @ManyToOne(() => Cycle, (oneCycle) => oneCycle.cycleFormulas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'cycle_id' }])
  cycle?: Cycle;

  @ApiPropertyOptional({ type: () => Formula })
  @ManyToOne(() => Formula, (formula) => formula.cycleFormulas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'formula_id' }])
  formula?: Formula;

  @ApiProperty()
  @Column({ type: 'float' })
  quantity: number;

  @ApiProperty({ enum: Usage })
  @Column({ name: 'usage', type: 'varchar', length: 16 })
  usage: Usage;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', length: 50, nullable: true })
  location?: string;
}
