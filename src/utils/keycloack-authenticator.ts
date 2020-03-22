import { APPLICATION_CONFIG } from '../application-config';
const { Issuer } = require('openid-client');
import { AuthenticationError } from './authentication-error';

export class KeyCloackAuthenticator {
  private _idp: string;
  private _clientId: string;

  constructor() {
    this._idp = APPLICATION_CONFIG().idp.url;
    this._clientId = APPLICATION_CONFIG().idp.clientId;
  }

  async authenticate(token: string): Promise<any> {
    // Authenticate to OpenId first
    try {
      const issuer = await Issuer.discover(this._idp);
      const Client = issuer.Client;
      const client = new Client({
        client_id: this._clientId
      });
      const userInfo = await client.userinfo(token);
      return userInfo;
    
    } catch (error) {
      throw new AuthenticationError(`Authentication error: ${error.message}`);
    }
  }
}
