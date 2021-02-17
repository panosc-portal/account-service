import { model, property } from '@loopback/repository';
import { Column, Entity, CreateDateColumn, JoinTable, ManyToMany, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employer } from './employer.model';
import { Role } from './role.model';

@Entity({name: 'users'})
@model()
export class User {
  @property({
    type: 'number',
    required: true
  })
  @PrimaryColumn()
  id: number;

  @property({
    type: 'string',
    required: true
  })
  @Column({ name: 'first_name', length: 100, nullable: true})
  firstName: string;

  @property({
    type: 'string',
    required: true
  })
  @Column({ name: 'last_name', length: 100, nullable: false})
  lastName: string;

  @property({
    type: 'string',
    required: false
  })
  @Column({ length: 100, nullable: true })
  email: string;

  @property({
    type: 'boolean',
    required: true
  })
  @Column({ nullable: false, default: false })
  activated: boolean;

  @property({
    type: 'date',
    required: true
  })
  @CreateDateColumn({ name: 'last_seen_at', type: 'date' })
  lastSeenAt: Date;

  @property({
    type: 'number',
    required: true
  })
  @Column({ name: 'instance_quota', type: 'integer', nullable: false })
  instanceQuota: number;

  @property({ type: Employer })
  @ManyToOne(type => Employer, { eager: true, nullable: true })
  @JoinColumn({ name: 'affiliation_id' })
  affiliation: Employer;

  @property({
    type: 'array',
    itemType: Role
  })
  @ManyToMany(type => Role, { eager: true, cascade: true })
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }

}
