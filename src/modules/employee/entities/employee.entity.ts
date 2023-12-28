import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
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
  @ManyToOne(() => Company, company => company.employees)
  company: Company;
}
