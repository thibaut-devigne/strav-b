import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  firstname: string;

  @Column({ type: 'text' })
  lastname: string;

  @Column({ unique: true, type: 'text' })
  email: string;

  @Column({ type: 'text' })
  password: string;
}