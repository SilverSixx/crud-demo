import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column({ default: 'employee' }) 
  user_role: string;
  
  isEmployee(): boolean {
    return this.user_role === 'employee';
  }

  isAdmin(): boolean {
    return this.user_role === 'admin';
  }
}
