import { model, property } from '@loopback/repository';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@model()
export class Role {
  @property({
    type: 'number',
    required: true
  })
  @PrimaryGeneratedColumn()
  id: number;

  @property({
    type: 'string',
    required: true
  })
  @Column({ length: 250, nullable: false })
  name: string;

  @property({
    type: 'string',
    required: true
  })
  @Column({ length: 1000, nullable: true })
  description: string;

  constructor(data?: Partial<Role>) {
    Object.assign(this, data);
  }
}
