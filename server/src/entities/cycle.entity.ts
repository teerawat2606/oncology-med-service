import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import CycleStatus from 'src/enums/CycleStatus';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CycleBottle } from './cycleBottle.entity';
import { CycleFormula } from './cycleFormula.entity';
import { CycleLog } from './cycleLog.entity';
import { User } from './user.entity';
import { Case } from './case.entity';

@Entity()
export class Cycle {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'case_id' })
  caseId: number;

  @ApiPropertyOptional({ type: () => Case })
  @ManyToOne(() => Case, (oneCase) => oneCase.id, { nullable: true })
  @JoinColumn({ name: 'case_id' })
  aCase?: Case;

  @ApiProperty()
  @Column({ name: 'cycle_number' })
  cycleNumber: number;

  @ApiPropertyOptional()
  @Column({ name: 'pre_medication', type: 'text', nullable: true })
  preMedication?: string;

  @ApiPropertyOptional()
  @Column({ name: 'is_emer', nullable: true })
  isEmer?: boolean;

  @ApiProperty({ enum: CycleStatus })
  @Index()
  @Column({
    type: 'enum',
    enum: CycleStatus,
    default: CycleStatus.OPEN,
  })
  status: CycleStatus;

  @ApiPropertyOptional()
  @Column({ name: 'is_insurance', nullable: true })
  isInsurance?: boolean;

  // unused
  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn([{ name: 'nurse_id' }])
  nurse?: User;

  // unused
  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn([{ name: 'pharmarcy_id' }])
  pharmacy?: User;

  @ApiProperty()
  @Column({ name: 'pharmacy_note', type: 'text', nullable: true })
  pharmacyNote?: string;

  // unused
  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn([{ name: 'inventory_id' }])
  inventory?: User;

  @ApiPropertyOptional()
  @Column({ name: 'inventory_note', type: 'text', nullable: true })
  inventoryNote?: string;

  @ApiPropertyOptional()
  @Column({ name: 'inventory_PRdate', type: 'date', nullable: true })
  inventoryPRdate?: string;

  @ApiPropertyOptional()
  @Column({ name: 'inventory_PRnumber', nullable: true })
  inventoryPRnumber?: number;

  @ApiPropertyOptional()
  @Column({ name: 'regimen_remark', type: 'text', nullable: true })
  regimenRemark?: string;

  @ApiPropertyOptional()
  @Column({
    name: 'regimen_medication',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  regimenMedication?: string;

  @ApiPropertyOptional()
  @Column({
    name: 'regimen_home_medication',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  regimenHomeMedication?: string;

  @ApiPropertyOptional()
  @Column({
    name: 'WBCmed_addinfo',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  WBCmedAddinfo?: string;

  @ApiPropertyOptional()
  @Column({ name: 'WBCmed_cost', type: 'float', nullable: true })
  WBCmedCost?: number;

  @ApiPropertyOptional()
  @Column({ name: 'takehome_med_cost', type: 'float', nullable: true })
  takehomeMedCost?: number;

  @ApiPropertyOptional()
  @Column({ name: 'doctor_equipment_cost', type: 'float', nullable: true })
  doctorEquipmentCost?: number;

  @ApiPropertyOptional()
  @Column({ name: 'doctor_expertise_cost', type: 'float', nullable: true })
  doctorExpertiseCost?: number;

  @ApiPropertyOptional()
  @Column({ name: 'blood_test_cost', type: 'float', nullable: true })
  bloodTestCost?: number;

  @ApiPropertyOptional()
  @Column({ name: 'premed_cost', type: 'float', nullable: true })
  premedCost?: number;

  @ApiPropertyOptional()
  @Column({ name: 'cycle_cost', type: 'float', nullable: true })
  cycleCost?: number;

  @ApiPropertyOptional({ type: () => [CycleBottle] })
  @OneToMany(() => CycleBottle, (cycleBottle) => cycleBottle.cycle, {
    cascade: true,
  })
  cycleBottles?: CycleBottle[];

  @ApiPropertyOptional({ type: () => [CycleFormula] })
  @OneToMany(() => CycleFormula, (cycleFormula) => cycleFormula.cycle, {
    cascade: true,
  })
  cycleFormulas?: CycleFormula[];

  @ApiPropertyOptional({ type: () => [CycleLog] })
  @OneToMany(() => CycleLog, (cycleLog) => cycleLog.cycle)
  cycleLogs?: CycleLog[];

  @ApiPropertyOptional()
  @Column({ name: 'appointment_date', type: 'date', nullable: true })
  appointmentDate?: string;
}
