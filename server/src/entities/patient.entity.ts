import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/enums';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Case } from './case.entity';

@Entity()
export class Patient {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  HN: number;

  @ApiProperty()
  @Index()
  @Column()
  name: string;

  @ApiProperty({ enum: Gender })
  @Column({ type: 'varchar', length: 10 })
  gender: Gender;

  @ApiProperty()
  @Column({ type: 'float', width: 3 })
  age: number;

  @ApiProperty()
  @Column({ type: 'float' })
  BW: number;

  @ApiProperty()
  @Column({ type: 'float' })
  Ht: number;

  @ApiProperty()
  @Column({ type: 'float' })
  BSA: number;

  @ApiProperty()
  @Column({ type: 'float' })
  sCr: number;

  @ApiProperty()
  @Column({ type: 'float' })
  ClCrM: number;

  @ApiProperty()
  @Column({ type: 'float' })
  ClCrF: number;

  @ApiPropertyOptional({ type: () => [Case] })
  @OneToMany(() => Case, (oneCase) => oneCase.patient)
  cases?: Case[];
}
