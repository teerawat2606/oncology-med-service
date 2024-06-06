import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegimenFormula } from './regimenFormula.entity';

@Entity()
export class Regimen {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  note?: string;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  remark?: string;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  premedication?: string;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  medication?: string;

  @ApiPropertyOptional()
  @Column({ name: 'home_med', type: 'varchar', length: 500, nullable: true })
  homeMed?: string;

  @ApiPropertyOptional({ type: () => [RegimenFormula] })
  @OneToMany(() => RegimenFormula, (regimenFormula) => regimenFormula.regimen, {
    cascade: true,
  })
  regimenFormulas?: RegimenFormula[];
}
