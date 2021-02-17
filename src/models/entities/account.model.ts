import { model, property } from '@loopback/repository';
import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';

@Entity()
@model()
export class Account {
  @property({
    type: 'number',
    required: true
  })
  @PrimaryGeneratedColumn()
  id: number;

  @property({
    type: 'number',
    required: true
  })
  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  @property({
    type: 'string',
    required: true
  })
  @Column({ length: 250, nullable: false, unique: true })
  username: string;

  @property({
    type: 'number',
    required: true
  })
  @Column({ type: 'integer', nullable: false })
  uid: number;

  @property({
    type: 'number',
    required: true
  })
  @Column({ type: 'integer', nullable: false })
  gid: number;

  @property({
    type: 'string',
    required: true
  })
  @Column({ name: 'home_path', length: 250, nullable: false })
  homePath: string;

  @property({
    type: 'date',
    required: true
  })
  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt: Date;

  constructor(data?: Partial<Account>) {
    Object.assign(this, data);
  }

  isValid(): boolean {
    return this.userId != null && this.username != null && this.uid != null && this.gid != null && this.homePath != null;
  }
}
