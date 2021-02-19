import { bind, BindingScope, inject } from '@loopback/core';
import { UserinfoResponse } from 'openid-client';
import { OpenIDDataSource } from '../datasources';
import { UserInfo } from '../models';
import { AuthenticationError } from '../utils';

@bind({ scope: BindingScope.SINGLETON })
export class AuthenticationService {

  constructor(@inject('datasources.open-id') private _openIdDataSource: OpenIDDataSource) {
  }

  async authenticate(accessToken: string): Promise<UserInfo> {

    let userinfoResponse: UserinfoResponse = null
    if (accessToken == null) {
      throw new AuthenticationError(`Authentication error: token is null`);

    } else {
      userinfoResponse = await this._openIdDataSource.authenticate(accessToken);
    }

    const userInfo = new UserInfo(userinfoResponse);

    return userInfo;
  }

}
