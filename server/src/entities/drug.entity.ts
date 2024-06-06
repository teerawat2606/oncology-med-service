import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Bottle } from './bottle.entity';
import { Formula } from './formula.entity';

@Entity()
@Unique(['name'])
export class Drug {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiPropertyOptional({ type: () => [Bottle] })
  @OneToMany(() => Bottle, (bottle) => bottle.drug)
  bottles?: Bottle[];

  @ApiPropertyOptional({ type: () => [Formula] })
  @OneToMany(() => Formula, (formula) => formula.drug, { cascade: true })
  formulas?: Formula[];
}
