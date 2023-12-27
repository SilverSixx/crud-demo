import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  employee_name: string;
  @Column()
  employee_email: string;
  @Column()
  employee_password: string;
  @Column()
  employee_role: string;
}
