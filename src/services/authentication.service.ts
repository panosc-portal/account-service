import { bind, BindingScope, inject } from '@loopback/core';
import { UserinfoResponse } from 'openid-client';
import { OpenIDDataSource } from '../datasources';
import { AuthenticationError } from '../utils';

@bind({ scope: BindingScope.SINGLETON })
export class AuthenticationService {

  constructor(@inject('datasources.typeorm') private _openIdDataSource: OpenIDDataSource) {
  }

  authenticate(accessToken: string | string[]): Promise<UserinfoResponse> {

    if (typeof accessToken === 'string') {
      return this._openIdDataSource.authenticate(accessToken);
    
    } else if (Array.isArray(accessToken)) {
      return this._openIdDataSource.authenticate(accessToken[0]);
    
    } else {
      throw new AuthenticationError(`Authentication error: Invalid type for token`);
    }
  }

}
