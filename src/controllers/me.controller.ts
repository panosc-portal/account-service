import { inject } from '@loopback/core';
import { get, getModelSchemaRef, HttpErrors, Request, RestBindings } from '@loopback/rest';
import { APPLICATION_CONFIG } from '../application-config';
import { BaseController } from './base.controller';
import { Account, Role } from '../models';
import { AccountService, RoleService } from '../services';
import { KeyCloackAuthenticator, LoggedError, AuthenticationError } from '../utils';
import { AttributeProviderHelper } from '../utils';

export class MeController extends BaseController {
  private _accountInfo: object;

  constructor(
    @inject(RestBindings.Http.REQUEST) private _request: Request,
    @inject('services.RoleService') private _roleService: RoleService,
    @inject('services.AccountService') private _accountService: AccountService
  ) {
    super();
  }

  @get('/me', {
    summary: 'Authenticates a JWT token and returns an Account object with its associated Role',
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

      const auth = new KeyCloackAuthenticator();

      if (typeof accessToken === 'string') {
        this._accountInfo = await auth.authenticate(accessToken);
      } else if (Array.isArray(accessToken)) {
        this._accountInfo = await auth.authenticate(accessToken[0]);
      } else {
        throw new LoggedError('Invalid type for token');
      }

      const account = await this.getDatabaseAccount();

      return account;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw new HttpErrors.Unauthorized(error.message);
      } else {
        throw new HttpErrors.InternalServerError(error.message);
      }
    }
  }

  async getDatabaseAccount(): Promise<Account> {
    // Checks that the selected login field is actually a property of openid client object
    const loginField = APPLICATION_CONFIG().idp.loginField;
    if (!this._accountInfo.hasOwnProperty(loginField)) {
      throw new LoggedError('Invalid login field for authenticated OpenId client');
    }

    // Checks that the person is registered in the db
    const username = this._accountInfo[loginField];
    const accounts: Account[] = await this._accountService.get({ where: { username: username } });

    // Case of multiplons, throws
    if (accounts.length > 1) {
      throw new LoggedError('Several users registered under the given login field');
    }

    // Case where the account is not registered in the db
    let account: Account;
    if (accounts.length > 0) {
      account = accounts[0];
    } else {
      const role: Role = await this._roleService.getById(APPLICATION_CONFIG().misc.default_role_id);
      account = new Account({
        username: username,
        roles: [role]
      });
    }

    try {
      const attrProviderHelper = new AttributeProviderHelper();
      const attrProvider = attrProviderHelper.getProvider();
      attrProvider.updateFromAccountInfo(account, this._accountInfo);
      attrProvider.update(account);
    } catch (error) {
      throw new LoggedError(error.message);
    }

    account = await this._accountService.save(account);

    return account;
  }
}
