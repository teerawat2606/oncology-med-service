import { CycleStatus } from 'src/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cycle } from './cycle.entity';

export enum DBAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Entity()
export class CycleLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cycle_id' })
  cycleId: number;

  @ManyToOne(() => Cycle, (oneCycle) => oneCycle.cycleLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'cycle_id' }])
  cycle: Cycle;

  @Column({
    type: 'enum',
    enum: CycleStatus,
    default: CycleStatus.OPEN,
  })
  status: CycleStatus;

  @Column({ type: 'enum', enum: DBAction })
  action: DBAction;

  @CreateDateColumn()
  actionTime: Date;
}
