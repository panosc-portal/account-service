import { model, property } from '@loopback/repository';

@model()
export class RoleCreatorDto {
  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string'
  })
  description?: string;
}
