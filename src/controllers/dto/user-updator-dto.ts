import { model, property } from '@loopback/repository';

@model()
export class UserUpdatorDto {
  @property({ type: 'number' })
  id: number;

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
  homedir: string;

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

  constructor(data?: Partial<UserUpdatorDto>) {
    Object.assign(this, data);
  }
}
