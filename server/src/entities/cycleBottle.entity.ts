import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Bottle } from './bottle.entity';
import { Cycle } from './cycle.entity';

@Entity()
export class CycleBottle {
  @ApiProperty()
  @PrimaryColumn({ name: 'cycle_id' })
  cycleId: number;

  @ApiProperty()
  @PrimaryColumn({ name: 'bottle_id' })
  bottleId: number;

  @ApiPropertyOptional({ type: () => Cycle })
  @ManyToOne(() => Cycle, (oneCycle) => oneCycle.cycleBottles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'cycle_id' }])
  cycle?: Cycle;

  @ApiPropertyOptional({ type: () => Bottle })
  @ManyToOne(() => Bottle, (bottle) => bottle.cycleBottles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'bottle_id' }])
  bottle?: Bottle;

  @ApiProperty()
  @Column({ type: 'int', width: 10 })
  quantity: number;

  @ApiPropertyOptional()
  @Column({ type: 'int', width: 10, nullable: true })
  obtained?: number;

  @ApiPropertyOptional()
  @Column({ type: 'int', width: 10, nullable: true })
  purchase?: number;

  @ApiPropertyOptional()
  @Column({ type: 'int', width: 10, nullable: true })
  return?: number;

  @ApiPropertyOptional()
  @Column({ name: 'return_received', type: 'int', width: 10, nullable: true })
  returnReceived?: number;
}
