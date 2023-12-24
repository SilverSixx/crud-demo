import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;
  @Column()
  user_password: string;
  @Column({ default: 'employee' }) 
  user_role: string;
  
  isEmployee(): boolean {
    return this.user_role === 'employee';
  }

  isAdmin(): boolean {
    return this.user_role === 'admin';
  }
}
