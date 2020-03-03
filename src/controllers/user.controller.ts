import { inject } from '@loopback/core';
import { del, get, getModelSchemaRef, param, post, requestBody } from '@loopback/rest';

import { BaseController } from './base.controller';
import { Role } from '../models';
import { UserCreatorDto } from './dto/user-creator-dto';
import { RoleService } from '../services';
import { UserService } from '../services';
import { User } from '../models';

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
    const persistedRole = await this._roleService.getById(roleId);
    this.throwNotFoundIfNull(user, 'Role with given id does not exist');

    const updatedUser: User = new User({
      username: user.username,
      email: user.email,
      uid: user.uid,
      gid: user.gid,
      active: user.active,
      homedir: user.homedir,
      role: persistedRole
    });

    return this._userService.save(updatedUser);
  }

  @del('/users/{userId}/roles/{roleId}', {
    summary: 'Deletes the role from a user',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteUserRole(@param.path.number('userId') userId: number, @param.path.string('roleId') roleId: number) {
    const user: User = await this._userService.getById(userId);
    this.throwNotFoundIfNull(user, 'User with given id does not exist');
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
    const allUsers = await this._userService.getAll();

    allUsers.forEach(user => this._userService.delete(user));
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
        content: { 'application/json': { schema: getModelSchemaRef(Role) } }
      }
    }
  })
  async createUser(@requestBody({ description: 'A user' }) userCreator: UserCreatorDto): Promise<User> {
    const role: Role = await this._roleService.getById(userCreator.role);
    this.throwNotFoundIfNull(role, 'Role with given id does not exist');

    const user: User = new User({
      username: userCreator.username,
      email: userCreator.email,
      homedir: userCreator.homedir,
      uid: userCreator.uid,
      gid: userCreator.gid,
      active: userCreator.active,
      role: role
    });

    const persistedUser = await this._userService.save(user);

    return persistedUser;
  }
}
