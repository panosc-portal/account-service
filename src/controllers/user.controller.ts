import { inject } from '@loopback/core';
import { del, get, getModelSchemaRef, param, post, put, requestBody } from '@loopback/rest';

import { BaseController } from './base.controller';
import { UserCreatorDto, UserUpdatorDto } from './dto';
import { Role, User } from '../models';
import { RoleService, UserService } from '../services';
import { LoggedError } from '../utils';

export class UserController extends BaseController {
  constructor(
    @inject('services.UserService') private _userService: UserService,
    @inject('services.RoleService') private _roleService: RoleService
  ) {
    super();
  }

  @get('/users', {
    summary: 'Gets a list of users',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(User) }
          }
        }
      }
    }
  })
  async getAllUsers(): Promise<User[]> {
    return await this._userService.getAll();
  }

  @get('/users/{id}', {
    summary: 'Gets a user',
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
    summary: 'Adds a role to a user',
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
    summary: 'Deletes the role from a user',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteUserRole(@param.path.number('userId') userId: number, @param.path.number('roleId') roleId: number) {
    const user: User = await this._userService.getById(userId);
    this.throwNotFoundIfNull(user, 'User with given id does not exist');

    // Fetches the role from its id
    const newRole = await this._roleService.getById(roleId);
    this.throwNotFoundIfNull(user, 'Role with given id does not exist');

    // Fetch the user roles (if any)
    user.roles = user.roles.filter(role => role.id !== newRole.id);

    this._userService.save(user);

    return user;
  }

  @del('/users', {
    summary: 'Deletes all user',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteAllUser() {
    const users = await this._userService.getAll();

    let success = true;
    for (const user of users) {
      success = success && (await this._userService.delete(user));
    }

    return success;
  }

  @del('/users/{id}', {
    summary: 'Deletes a user',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteUser(@param.path.number('id') id: number) {
    const user = await this._userService.getById(id);
    this.throwNotFoundIfNull(user, 'User with given id does not exist');

    return this._userService.delete(user);
  }

  @post('/users', {
    summary: 'Creates a User',
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async createUser(@requestBody({ description: 'A user' }) userCreator: UserCreatorDto): Promise<User> {
    // Remove duplicates if any
    const temp = new Set(userCreator.roles);
    const userRoles = [...temp];

    // Loop over the user roles and check that ALL of them are valid roles
    let roles: Role[] = [];
    for (const roleId of userRoles) {
      const role = await this._roleService.getById(roleId);
      if (!role) {
        throw new LoggedError(`Role with id ${roleId} does not exist`);
      }
      roles.push(role);
    }

    const user: User = new User({
      facilityUserId: userCreator.facilityUserId,
      username: userCreator.username,
      email: userCreator.email,
      homePath: userCreator.homePath,
      uid: userCreator.uid,
      gid: userCreator.gid,
      active: userCreator.active,
      roles: roles
    });

    const persistedUser = await this._userService.save(user);

    return persistedUser;
  }

  @put('/users/{userId}', {
    summary: 'Updates a user by a given identifier',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User)
          }
        }
      }
    }
  })
  async update(
    @param.path.number('userId') userId: number,
    @requestBody() userUpdatorDto: UserUpdatorDto
  ): Promise<User> {
    this.throwBadRequestIfNull(userUpdatorDto, 'Invalid user in request');
    this.throwBadRequestIfNotEqual(userId, userUpdatorDto.id, 'Id in path is not the same as body id');

    // Get the user
    const user = await this._userService.getById(userId);
    this.throwNotFoundIfNull(user, 'User with given id does not exist');

    // Remove duplicates roles if any
    const temp = new Set(userUpdatorDto.roles);
    const userRoles = [...temp];

    // Loop over the user roles and check that ALL of them are valid roles
    let roles: Role[] = [];
    for (const roleId of userRoles) {
      const role = await this._roleService.getById(roleId);
      if (!role) {
        throw new LoggedError(`Role with id ${roleId} does not exist`);
      }
      roles.push(role);
    }

    const updatedUser = new User({
      id: userUpdatorDto.id,
      facilityUserId: userUpdatorDto.facilityUserId,
      username: userUpdatorDto.username,
      email: userUpdatorDto.email,
      homePath: userUpdatorDto.homePath,
      uid: userUpdatorDto.uid,
      gid: userUpdatorDto.gid,
      active: userUpdatorDto.active,
      roles: roles
    });

    return this._userService.save(updatedUser);
  }
}
