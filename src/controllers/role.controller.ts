import { inject } from '@loopback/core';
import { del, get, param, post, put, getModelSchemaRef, requestBody } from '@loopback/rest';

import { BaseController } from './base.controller';
import { RoleCreatorDto, RoleUpdatorDto } from './dto';
import { Role } from '../models';
import { RoleService } from '../services';

export class RoleController extends BaseController {
  constructor(@inject('services.RoleService') private _roleService: RoleService) {
    super();
  }

  @get('/roles', {
    summary: 'Returns all possible roles',
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

  @get('/roles/{id}', {
    summary: 'Gets a role',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { schema: getModelSchemaRef(Role) }
          }
        }
      }
    }
  })
  async getRole(@param.path.number('id') id: number): Promise<Role> {
    return await this._roleService.getById(id);
  }

  @post('/roles', {
    summary: 'Creates a Role',
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Role) } }
      }
    }
  })
  async createRole(@requestBody() roleCreator: RoleCreatorDto): Promise<Role> {
    const role: Role = new Role({
      name: roleCreator.name,
      description: roleCreator.description
    });

    const persistedRole = await this._roleService.save(role);

    return persistedRole;
  }

  @put('/roles/{roleId}', {
    summary: 'Update a role by a given identifier',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Role)
          }
        }
      }
    }
  })
  async update(
    @param.path.number('roleId') roleId: number,
    @requestBody() roleUpdatorDto: RoleUpdatorDto
  ): Promise<Role> {
    this.throwBadRequestIfNull(roleUpdatorDto, 'Invalid role in request');
    this.throwBadRequestIfNotEqual(roleId, roleUpdatorDto.id, 'Id in path is not the same as body id');

    // Get the role
    const role = await this._roleService.getById(roleId);
    this.throwNotFoundIfNull(role, 'Role with given id does not exist');

    const updatedRole = new Role({
      id: roleUpdatorDto.id,
      name: roleUpdatorDto.name,
      description: roleUpdatorDto.description
    });

    return this._roleService.save(updatedRole);
  }

  @del('/roles/{id}', {
    summary: 'Deletes a Role',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteRole(@param.path.number('id') id: number): Promise<boolean> {
    const role = await this._roleService.getById(id);
    this.throwNotFoundIfNull(role, 'Role with given id does not exist');

    return this._roleService.delete(role);
  }

  @del('/roles', {
    summary: 'Deletes all Roles',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteAllRoles() {
    const roles: Role[] = await this._roleService.getAll();

    let success = true;
    for (const role of roles) {
      success = success && (await this._roleService.delete(role));
    }

    return success;
  }
}
