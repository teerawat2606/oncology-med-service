import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CycleBottle } from './cycleBottle.entity';
import { Drug } from './drug.entity';

@Entity()
export class Bottle {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'int', name: 'drug_id' })
  drugId: number;

  @ApiPropertyOptional({ type: () => Drug })
  @ManyToOne(() => Drug, (drug) => drug.bottles)
  @JoinColumn([{ name: 'drug_id' }])
  drug?: Drug;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @ApiProperty()
  @Column({ type: 'float' })
  cost: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  inventory: number;

  @ApiPropertyOptional({ type: () => [CycleBottle] })
  @OneToMany(() => CycleBottle, (cycleBottle) => cycleBottle.bottle)
  cycleBottles?: CycleBottle[];
}
