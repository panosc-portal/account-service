import { inject } from '@loopback/core';
import { del, get, getModelSchemaRef, HttpErrors, param, post, requestBody } from '@loopback/rest';

import { BaseController } from './base.controller';
import { Paginated, Query, QueryError, QueryPagination, User } from '../models';
import { RoleService, UserService } from '../services';
import { Http2ServerRequest } from 'http2';

export class UserController extends BaseController {
  constructor(
    @inject('services.UserService') private _userService: UserService,
    @inject('services.RoleService') private _roleService: RoleService) {
      super();
  }

  @post('/users/search', {
    summary: 'Gets a list of users',
    tags: [
      'User'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Paginated) } }
      }
    }
  })
  async searchForUsers(@requestBody() query: Query): Promise<Paginated<User>> {
    if (query == null) {
      query = {};
    }

    // Default alias and order
    query.alias = query.alias ? query.alias : 'user';
    query.orderBy = query.orderBy ? query.orderBy : [{alias: `${query.alias}.lastName`, direction: 'ASC'}];

    try {
      const results = await this._userService.executeSearchQuery(query);
      return results;

    } catch (error) {
      if (error instanceof QueryError) {
        throw new HttpErrors.BadRequest(error.message);
      
      } else {
        throw new HttpErrors.InternalServerError(error.message);
      }
    }
  }

  @get('/users/{id}', {
    summary: 'Gets an user',
    tags: [
      'User'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async getUser(@param.path.number('id') id: number): Promise<User> {
    return await this._userService.getById(id);
  }

  @post('/users/{userId}/roles/{roleId}', {
    summary: 'Adds a role to an user',
    tags: [
      'User'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async addUserRole(
    @param.path.number('userId') userId: number,
    @param.path.number('roleId') roleId: number
  ): Promise<User> {
    // Fetches the user from its id
    const user = await this._userService.getById(userId);
    this.throwNotFoundIfNull(user, 'User with given id does not exist');

    // Fetches the role from its id
    const newRole = await this._roleService.getById(roleId);
    this.throwNotFoundIfNull(user, 'Role with given id does not exist');

    // Fetch the user roles (if any)
    const userRoles = user.roles;
    const existingRole = user.roles.find(role => role.id === newRole.id);
    if (existingRole == null) {
      userRoles.push(newRole);
      await this._userService.save(user);
    }

    return user;
  }

  @del('/users/{userId}/roles/{roleId}', {
    summary: 'Deletes the role from an user',
    tags: [
      'User'
    ],
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteUserRole(
    @param.path.number('userId') userId: number,
    @param.path.number('roleId') roleId: number
  ) {
    const user: User = await this._userService.getById(userId);
    this.throwNotFoundIfNull(user, 'User with given id does not exist');

    // Fetches the role from its id
    const newRole = await this._roleService.getById(roleId);
    this.throwNotFoundIfNull(user, 'Role with given id does not exist');

    // Fetch the user roles (if any)
    user.roles = user.roles.filter(role => role.id !== newRole.id);

    await this._userService.save(user);

    return user;
  }

}
