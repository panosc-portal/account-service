import { APPLICATION_CONFIG } from '../application-config';
import { Client, Issuer, UserinfoResponse } from 'openid-client';
import { LifeCycleObserver, lifeCycleObserver } from '@loopback/core';
import { AuthenticationError, logger } from '../utils';

@lifeCycleObserver('datasource')
export class OpenIDDataSource implements LifeCycleObserver {

  private _client: Client;

  constructor() {
  }

  /**
   * Create client for the OpenID connect provider
   */
  async start(): Promise<void> {
    logger.info('Initialising openid provider');
    this._client = await this.createClient();
  }

  private async createClient(): Promise<Client> {
    const idpUrl = APPLICATION_CONFIG().idp.url;
    const clientId = APPLICATION_CONFIG().idp.clientId;

    try {
      const issuer = await Issuer.discover(idpUrl);
      const client = new issuer.Client({
        client_id: clientId
      });

      return client;
    } catch (error) {
      logger.error(`Could not create client for OpenID Connect provider at ${idpUrl} : ${error.message}`);

      process.exit();
    }
  }

  async authenticate(token: string): Promise<UserinfoResponse> {
    try {
      // Authenticate to OpenId first
      const userInfo = await this._client.userinfo(token);
      return userInfo;
    
    } catch (error) {
      throw new AuthenticationError(`Authentication error: ${error.message}`);
    }
  }
}
