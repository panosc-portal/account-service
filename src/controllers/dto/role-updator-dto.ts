import { model, property } from '@loopback/repository';

@model()
export class RoleUpdatorDto {
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

  constructor(data?: Partial<RoleUpdatorDto>) {
    Object.assign(this, data);
  }
}
