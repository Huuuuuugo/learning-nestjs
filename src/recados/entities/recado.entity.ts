import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  recado: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  from: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  to: string;

  @Column({ default: false })
  seen: boolean;

  @CreateDateColumn()
  date: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
