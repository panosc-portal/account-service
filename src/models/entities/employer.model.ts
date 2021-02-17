import { model, property } from '@loopback/repository';
import { Column, Entity, CreateDateColumn, JoinTable, ManyToMany, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
@model()
export class Employer {
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
  @Column({ length: 200, nullable: true})
  name: string;

  @property({
    type: 'string',
    required: true
  })
  @Column({ length: 100, nullable: true})
  town: string;

  @property({
    type: 'string',
    required: true
  })
  @Column({ name: 'country_code', length: 10, nullable: true})
  countryCode: string;

  constructor(data?: Partial<Employer>) {
    Object.assign(this, data);
  }

}
