import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormulaUnit } from 'src/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CycleFormula } from './cycleFormula.entity';
import { Drug } from './drug.entity';
import { RegimenFormula } from './regimenFormula.entity';

@Entity()
export class Formula {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'drug_id' })
  drugId: number;

  @ApiPropertyOptional({ type: () => Drug })
  @ManyToOne(() => Drug, (drug) => drug.formulas)
  @JoinColumn([{ name: 'drug_id' }])
  drug: Drug;

  @ApiProperty()
  @Column({ name: 'formula_quantity', type: 'float' })
  formulaQuantity: number;

  @ApiPropertyOptional()
  @Column({ name: 'max_formula_quantity', type: 'float', nullable: true })
  maxFormulaQuantity?: number;

  @ApiProperty({ enum: FormulaUnit })
  @Column({ name: 'formula_unit', type: 'varchar', length: 10 })
  formulaUnit: FormulaUnit;

  @ApiPropertyOptional()
  @Column({
    name: 'dilute_description',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  diluteDescription?: string;

  @ApiPropertyOptional({ type: () => [RegimenFormula] })
  @OneToMany(() => RegimenFormula, (regimenFormula) => regimenFormula.formula)
  regimenFormulas?: RegimenFormula[];

  @ApiPropertyOptional({ type: () => [CycleFormula] })
  @OneToMany(() => CycleFormula, (cycleFormula) => cycleFormula.formula)
  cycleFormulas?: CycleFormula[];
}
