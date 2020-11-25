import { UserinfoResponse } from 'openid-client';
import { APPLICATION_CONFIG } from '../application-config';
import { logger } from '../utils';

export class UserInfo {

  private _loginField: string;
  private _isValid: boolean;

  get isValid(): boolean {
    return this._isValid;
  }

  get username(): string {
    // Get the username
    const username = this._userinfoResponse[this._loginField] as string;

    return username;
  }

  constructor(private _userinfoResponse: UserinfoResponse) {
    this._loginField = APPLICATION_CONFIG().idp.loginField;
    
    if (!this._userinfoResponse.hasOwnProperty(this._loginField)) {
      // Check that the selected login field is actually a property of openid client object
      logger.error('Invalid login field for authenticated OpenId client');
      this._isValid = false;
    
    } else if (this.username == null) {
      // Check for null username
      logger.error('IDP returned a null username');
      this._isValid = false;
    
    } else {
      this._isValid = true;
    }
  }

  get(attribute: string): any {
    return this._userinfoResponse[attribute];
  }

}
