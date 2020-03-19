import { inject } from '@loopback/core';
import { get, getModelSchemaRef, HttpErrors, Request, RestBindings } from '@loopback/rest';
import { APPLICATION_CONFIG } from '../application-config';
import { BaseController } from './base.controller';
import { Role, User } from '../models';
import { RoleService, UserService } from '../services';
import { KeyCloackAuthenticator, LoggedError } from '../utils';
import { AttributeProviderHelper } from '../utils';

export class MeController extends BaseController {
  private _userInfo: object;

  constructor(
    @inject(RestBindings.Http.REQUEST) private _request: Request,
    @inject('services.RoleService') private _roleService: RoleService,
    @inject('services.UserService') private _userService: UserService
  ) {
    super();
  }

  @get('/me', {
    summary: 'Authenticates a JWT token and returns a User object with its associated Role',
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async me(): Promise<User> {
    const accessToken = this._request.headers.access_token;

    const auth = new KeyCloackAuthenticator();

    if (typeof accessToken === 'string') {
      this._userInfo = await auth.authenticate(accessToken);
    } else if (Array.isArray(accessToken)) {
      this._userInfo = await auth.authenticate(accessToken[0]);
    } else {
      throw new LoggedError('Invalid type for token');
    }

    const user: Promise<User> = this.getDatabaseUser();

    return user;
  }

  async getDatabaseUser(): Promise<User> {
    // Checks that the selected login field is actually a property of openid client object
    const loginField = APPLICATION_CONFIG().idp.loginField;
    if (!this._userInfo.hasOwnProperty(loginField)) {
      throw new LoggedError('Invalid login field for authenticated OpenId client');
    }

    // Checks that the person is registered in the db
    const username = this._userInfo[loginField];
    const users: User[] = await this._userService.get({ where: { username: username } });

    // Case of multiplons, throws
    if (users.length > 1) {
      throw new LoggedError('Several users registered under the given login field');
    }

    // Case where the user is not registered in the db
    let user: User;
    if (users.length > 0) {
      user = users[0];
    } else {
      const role: Role = await this._roleService.getById(APPLICATION_CONFIG().misc.default_role_id);
      user = new User({
        username: username,
        roles: [role]
      });
    }

    try {
      const attrProviderHelper = new AttributeProviderHelper();
      const attrProvider = attrProviderHelper.getProvider();
      attrProvider.updateFromUserInfo(user, this._userInfo);
      attrProvider.update(user);
    } catch (error) {
      throw new LoggedError(error);
    }

    if (user.id != null) {
      user = await this._userService.update(user.id, user);
    } else {
      user = await this._userService.save(user);
    }

    return user;
  }
}
