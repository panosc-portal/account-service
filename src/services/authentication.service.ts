import { bind, BindingScope, inject } from '@loopback/core';
import { UserinfoResponse } from 'openid-client';
import { OpenIDDataSource } from '../datasources';
import { UserInfo } from '../models';
import { AuthenticationError } from '../utils';

@bind({ scope: BindingScope.SINGLETON })
export class AuthenticationService {

  constructor(@inject('datasources.open-id') private _openIdDataSource: OpenIDDataSource) {
  }

  async authenticate(accessToken: string | string[]): Promise<UserInfo> {

    let userinfoResponse: UserinfoResponse = null
    if (accessToken == null) {
      throw new AuthenticationError(`Authentication error: token is null`);

    } else if (typeof accessToken === 'string') {
      userinfoResponse = await this._openIdDataSource.authenticate(accessToken);
    
    } else if (Array.isArray(accessToken)) {
      userinfoResponse = await this._openIdDataSource.authenticate(accessToken[0]);
    
    } else {
      throw new AuthenticationError(`Authentication error: Invalid type for token`);
    }

    const userInfo = new UserInfo(userinfoResponse);

    return userInfo;
  }

}
