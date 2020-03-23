import { model, property } from '@loopback/repository';

@model()
export class AccountUpdatorDto {
  @property({ type: 'number' })
  id: number;

  @property({
    type: 'number'
  })
  userId: number;

  @property({
    type: 'string',
    required: true
  })
  username: string;

  @property({
    type: 'string'
  })
  email: string;

  @property({
    type: 'string'
  })
  homePath: string;

  @property({
    type: 'number'
  })
  uid: number;

  @property({
    type: 'number'
  })
  gid: number;

  @property({
    type: 'boolean'
  })
  active: boolean;

  @property({
    type: 'array',
    itemType: 'number'
  })
  roles: number[];

  constructor(data?: Partial<AccountUpdatorDto>) {
    Object.assign(this, data);
  }
}
