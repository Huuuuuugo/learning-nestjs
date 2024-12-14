import { Pessoa } from 'src/pessoa/entities/pessoa.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  recado: string;

  @ManyToOne(() => Pessoa)
  @JoinColumn({ name: 'sender_id' })
  from: Pessoa;

  @ManyToOne(() => Pessoa)
  @JoinColumn({ name: 'receiver_id' })
  to: Pessoa;

  @Column({ default: false })
  seen: boolean;

  @CreateDateColumn()
  date: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
