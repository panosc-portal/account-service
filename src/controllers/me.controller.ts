import { inject } from '@loopback/core';
import { get, getModelSchemaRef, HttpErrors, Request, RestBindings } from '@loopback/rest';
import { APPLICATION_CONFIG } from '../application-config';
import { BaseController } from './base.controller';
import { Account, Role } from '../models';
import { AccountService, AuthenticationService, RoleService } from '../services';
import { LoggedError, AuthenticationError } from '../utils';
import { AttributeProviderHelper } from '../utils';
import { UserinfoResponse } from 'openid-client';

export class MeController extends BaseController {

  private _attributeProviderHelper: AttributeProviderHelper;

  constructor(
    @inject(RestBindings.Http.REQUEST) private _request: Request,
    @inject('services.RoleService') private _roleService: RoleService,
    @inject('services.AccountService') private _accountService: AccountService,
    @inject('services.AuthenticationService') private _authenticationService: AuthenticationService
  ) {
    super();
    this._attributeProviderHelper = new AttributeProviderHelper();
  }

  @get('/me', {
    summary: 'Authenticates a JWT token and returns an Account object with its associated Role',
    tags: [
      'Me'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Account) } }
      }
    }
  })
  async me(): Promise<Account> {
    try {
      const accessToken = this._request.headers.access_token;

      const userinfo = await this._authenticationService.authenticate(accessToken);
      const username = this.getUsername(userinfo);

      // Get account from the account service
      let account = await this._accountService.getAccountForUsername(username);

      // Update account atributes from the provider
      this._attributeProviderHelper.setAccountAttributes(account, userinfo)
      this._accountService.save(account);

      return account;

    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw new HttpErrors.Unauthorized(error.message);
      } else {
        throw new HttpErrors.InternalServerError(error.message);
      }
    }
  }

  getUsername(userinfo: UserinfoResponse): string {
    // Checks that the selected login field is actually a property of openid client object
    const loginField = APPLICATION_CONFIG().idp.loginField;
    
    if (!userinfo.hasOwnProperty(loginField)) {
      throw new LoggedError('Invalid login field for authenticated OpenId client');
    }

    // Get the username
    const username = userinfo[loginField] as string;
    if (username == null) {
      throw new LoggedError('IDP returned a null username');
    }

    return username;
  }
}
