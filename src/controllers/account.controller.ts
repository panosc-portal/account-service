import { inject } from '@loopback/core';
import { del, get, getModelSchemaRef, HttpErrors, param, post, put, requestBody } from '@loopback/rest';

import { BaseController } from './base.controller';
import { AccountCreatorDto, AccountUpdatorDto } from './dto';
import { Account, Role } from '../models';
import { AccountService, AuthenticationService, RoleService } from '../services';
import { AuthenticationError, LoggedError, logger } from '../utils';

export class AccountController extends BaseController {
  constructor(
    @inject('services.AccountService') private _accountService: AccountService,
    @inject('services.RoleService') private _roleService: RoleService,
    @inject('services.AuthenticationService') private _authenticationService: AuthenticationService) {
      super();
  }

  @get('/account', {
    summary: 'Authenticates a JWT token and returns an Account object with its associated Role',
    tags: [
      'Account'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Account) } }
      }
    }
  })
  async account(@param.header.string('access_token') accessToken: string): Promise<Account> {
    try {
      const userInfo = await this._authenticationService.authenticate(accessToken);

      // Get account from the account service
      let account = await this._accountService.getAccountForUsername(userInfo);

      logger.debug(`Successfully authenticated user: ${account.username} (${account.userId})`);

      return account;

    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw new HttpErrors.Unauthorized(error.message);
        
      } else {
        throw new HttpErrors.InternalServerError(error.message);
      }
    }
  }

  @get('/accounts', {
    summary: 'Gets a list of accounts',
    tags: [
      'Account'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Account) }
          }
        }
      }
    }
  })
  async getAllAccounts(): Promise<Account[]> {
    return await this._accountService.getAll();
  }

  @get('/accounts/{id}', {
    summary: 'Gets an account',
    tags: [
      'Account'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Account) } }
      }
    }
  })
  async getAccount(@param.path.number('id') id: number): Promise<Account> {
    return await this._accountService.getById(id);
  }

  @post('/accounts/{accountId}/roles/{roleId}', {
    summary: 'Adds a role to an account',
    tags: [
      'Account'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Account) } }
      }
    }
  })
  async addAccountRole(
    @param.path.number('accountId') accountId: number,
    @param.path.number('roleId') roleId: number
  ): Promise<Account> {
    // Fetches the account from its id
    const account = await this._accountService.getById(accountId);
    this.throwNotFoundIfNull(account, 'Account with given id does not exist');

    // Fetches the role from its id
    const newRole = await this._roleService.getById(roleId);
    this.throwNotFoundIfNull(account, 'Role with given id does not exist');

    // Fetch the account roles (if any)
    const accountRoles = account.roles;
    const existingRole = account.roles.find(role => role.id === newRole.id);
    if (existingRole == null) {
      accountRoles.push(newRole);
      await this._accountService.save(account);
    }

    return account;
  }

  @del('/accounts/{accountId}/roles/{roleId}', {
    summary: 'Deletes the role from an account',
    tags: [
      'Account'
    ],
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteAccountRole(
    @param.path.number('accountId') accountId: number,
    @param.path.number('roleId') roleId: number
  ) {
    const account: Account = await this._accountService.getById(accountId);
    this.throwNotFoundIfNull(account, 'Account with given id does not exist');

    // Fetches the role from its id
    const newRole = await this._roleService.getById(roleId);
    this.throwNotFoundIfNull(account, 'Role with given id does not exist');

    // Fetch the account roles (if any)
    account.roles = account.roles.filter(role => role.id !== newRole.id);

    this._accountService.save(account);

    return account;
  }

  @del('/accounts/{id}', {
    summary: 'Deletes an account',
    tags: [
      'Account'
    ],
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteAccount(@param.path.number('id') id: number) {
    const account = await this._accountService.getById(id);
    this.throwNotFoundIfNull(account, 'Account with given id does not exist');

    return this._accountService.delete(account);
  }

  @post('/accounts', {
    summary: 'Creates an account',
    tags: [
      'Account'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Account) } }
      }
    }
  })
  async createAccount(@requestBody({ description: 'An account' }) accountCreator: AccountCreatorDto): Promise<Account> {
    // Remove duplicates if any
    const temp = new Set(accountCreator.roles);
    const accountRoles = [...temp];

    // Loop over the account roles and check that ALL of them are valid roles
    let roles: Role[] = [];
    for (const roleId of accountRoles) {
      const role = await this._roleService.getById(roleId);
      if (!role) {
        throw new LoggedError(`Role with id ${roleId} does not exist`);
      }
      roles.push(role);
    }

    const account = new Account({
      userId: accountCreator.userId,
      username: accountCreator.username,
      email: accountCreator.email,
      homePath: accountCreator.homePath,
      uid: accountCreator.uid,
      gid: accountCreator.gid,
      active: accountCreator.active,
      roles: roles
    });

    const persistedAccount = await this._accountService.save(account);

    return persistedAccount;
  }

  @put('/accounts/{accountId}', {
    summary: 'Updates an account by a given identifier',
    tags: [
      'Account'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Account)
          }
        }
      }
    }
  })
  async update(
    @param.path.number('accountId') accountId: number,
    @requestBody() accountUpdatorDto: AccountUpdatorDto
  ): Promise<Account> {
    this.throwBadRequestIfNull(accountUpdatorDto, 'Invalid account in request');
    this.throwBadRequestIfNotEqual(accountId, accountUpdatorDto.id, 'Id in path is not the same as body id');

    // Get the account
    const account = await this._accountService.getById(accountId);
    this.throwNotFoundIfNull(account, 'Account with given id does not exist');

    // Remove duplicates roles if any
    const temp = new Set(accountUpdatorDto.roles);
    const accountRoles = [...temp];

    // Loop over the account roles and check that ALL of them are valid roles
    let roles: Role[] = [];
    for (const roleId of accountRoles) {
      const role = await this._roleService.getById(roleId);
      if (!role) {
        throw new LoggedError(`Role with id ${roleId} does not exist`);
      }
      roles.push(role);
    }

    const updatedAccount = new Account({
      id: accountUpdatorDto.id,
      userId: accountUpdatorDto.userId,
      username: accountUpdatorDto.username,
      email: accountUpdatorDto.email,
      homePath: accountUpdatorDto.homePath,
      uid: accountUpdatorDto.uid,
      gid: accountUpdatorDto.gid,
      active: accountUpdatorDto.active,
      roles: roles
    });

    return this._accountService.save(updatedAccount);
  }
  
}
