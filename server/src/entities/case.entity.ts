import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { User } from './user.entity';
import { Cycle } from './cycle.entity';
import { Regimen } from './regimen.entity';

@Entity()
export class Case {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Patient })
  @ManyToOne(() => Patient, (patient) => patient.HN)
  @JoinColumn([{ name: 'patient_HN' }])
  patient: Patient;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: 'oncology' })
  department: string;

  @ApiPropertyOptional({ type: () => User })
  @Index()
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn([{ name: 'doctor_id' }])
  doctor: User;

  @ApiPropertyOptional({ type: () => Regimen })
  @ManyToOne(() => Regimen, (regimen) => regimen.id, {
    nullable: true,
  })
  @JoinColumn([{ name: 'regimen_id' }])
  regimen?: Regimen;

  @ApiPropertyOptional()
  @Column({ name: 'total_cycles', nullable: true })
  totalCycles?: number;

  @ApiPropertyOptional({ type: () => [Cycle] })
  @OneToMany(() => Cycle, (cycle) => cycle.aCase)
  cycles: Cycle[];
}
