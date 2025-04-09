import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SessionType {
  TRAINING = 'training',
  RACE = 'race',
  LEISURE = 'leisure',
}

export enum ActivityType {
  RUNNING = 'running',
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: Number;

  @ManyToOne(() => User, (user) => user.runningSessions, { nullable: false, eager: true })
  user: User;

  @Column({ type: 'enum', enum: ActivityType })
  activityType: ActivityType;

  @Column({ type: 'enum', enum: SessionType })
  type: SessionType;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'int' })
  duration: number; // en secondes

  @Column({ type: 'float' })
  distance: number; // en kilomètres

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;
}