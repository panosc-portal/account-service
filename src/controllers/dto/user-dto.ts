import { model, property } from '@loopback/repository';
import { Role } from '../../models';

@model()
export class UserDto {
  @property({ type: 'number' })
  id: number;

  @property({
    type: 'number'
  })
  facilityUserId: number;

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
  roles: Role[];

  constructor(data?: Partial<UserDto>) {
    Object.assign(this, data);
  }
}
