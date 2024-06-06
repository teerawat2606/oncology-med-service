import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from 'src/enums';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  username: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 120 })
  password: string;

  @ApiProperty({ enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: 'oncology' })
  department: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty()
  @Column({ name: 'employee_id', type: 'varchar', length: 100 })
  employeeId: string;

  @ApiPropertyOptional()
  @Column({ name: 'line_id', type: 'varchar', length: 30, nullable: true })
  lineId?: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, default: 'Bangkok Pattaya Hospital' })
  hospital: string;
}
