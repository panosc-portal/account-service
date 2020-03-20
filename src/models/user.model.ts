import { model, property } from '@loopback/repository';
import { Column, Entity, CreateDateColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.model';

@Entity()
@model()
export class User {
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
  @Column({name: 'facility_user_id', type: 'integer'})
  facilityUserId: number;

  @property({
    type: 'string',
    required: true
  })
  @Column({ length: 250, nullable: false })
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
    required: false
  })
  @Column({ length: 250, nullable: true })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  @Column({ length: 250, nullable: false })
  homedir: string;

  @property({
    type: 'boolean',
    required: true
  })
  @Column({ nullable: false, default: true })
  active: boolean;

  @property({
    type: 'date',
    required: true
  })
  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt: Date;

  @property({
    type: 'array',
    itemType: Role
  })
  @ManyToMany(type => Role, { eager: true, nullable: true })
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}
