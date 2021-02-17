import { inject } from '@loopback/core';
import { get, getModelSchemaRef, HttpErrors, param, } from '@loopback/rest';

import { BaseController } from './base.controller';
import { Account, AuthenticationToken } from '../models';
import { AccountService, AuthenticationService, RoleService, UserService } from '../services';
import { AuthenticationError, logger } from '../utils';
import { AttributeService } from '../services/attribute.service';

export class AccountController extends BaseController {
  constructor(
    @inject('services.AccountService') private _accountService: AccountService,
    @inject('services.UserService') private _userService: UserService,
    @inject('services.RoleService') private _roleService: RoleService,
    @inject('services.AttributeService') private _attributeService: AttributeService,
    @inject('services.AuthenticationService') private _authenticationService: AuthenticationService) {
      super();
  }

  @get('/authenticate', {
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
  async authenticate(@param.header.string('access_token') accessToken: string): Promise<AuthenticationToken> {
    try {
      // Authentication 
      const userInfo = await this._authenticationService.authenticate(accessToken);

      // Get account from the account service
      const account = await this._accountService.getAccount(userInfo);

      // Get user from user service
      const user = await this._userService.getOrCreateUser(account.userId, userInfo);

      logger.info(`Successfully authenticated user: ${account.username} (${account.userId})`);
      if (user.id === 0) {
          logger.error(`User ${user.fullName} with login ${account.username} has an invalid user id (0)`);
      }
 
      return new AuthenticationToken({
        account: account,
        user: user
      });

    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw new HttpErrors.Unauthorized(error.message);
        
      } else {
        throw new HttpErrors.InternalServerError(error.message);
      }
    }
  }
  
}
