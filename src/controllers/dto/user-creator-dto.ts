import { model, property } from '@loopback/repository';

@model()
export class UserCreatorDto {
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
    type: 'number'
  })
  role: number;
}
