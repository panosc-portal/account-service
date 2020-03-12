import { model, property } from '@loopback/repository';

@model()
export class RoleDto {
  @property({ type: 'number' })
  id: number;

  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string'
  })
  description?: string;

  constructor(data?: Partial<RoleDto>) {
    Object.assign(this, data);
  }
}
