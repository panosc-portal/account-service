import { inject } from '@loopback/core';
import { get, getModelSchemaRef } from '@loopback/rest';

import { BaseController } from './base.controller';
import { Role } from '../models';
import { RoleService } from '../services';

export class RoleController extends BaseController {
  constructor(@inject('services.RoleService') private _roleService: RoleService) {
    super();
  }

  @get('/roles', {
    summary: 'Returns all possible roles',
    tags: [
      'Role'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Role) }
          }
        }
      }
    }
  })
  async getAllRoles(): Promise<Role[]> {
    return await this._roleService.getAll();
  }

}