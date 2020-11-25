import { Account, UserInfo } from '../models';
import { logger } from '../utils/logger';

export interface IAccountAttributeProvider {
  setAccountAttributes(account: Account, userInfo?: UserInfo): any;
}

export class AccountAttributeProviderHelper  {

  private _loadProvider(attributeProviderPath: string): IAccountAttributeProvider {
    if (attributeProviderPath != null) {
      try {
        let fullPath = attributeProviderPath;
        if (!attributeProviderPath.startsWith('/')) {
          fullPath = `../../${attributeProviderPath}`;
        }

        const attributeProvider = require(fullPath) as IAccountAttributeProvider;
        if (this._validateProvider(attributeProvider)) {
          return attributeProvider;
        }

      } catch (error) {
        logger.error(`Could not load attribute provider with the file path '${attributeProviderPath}'`);
      }
    }

    return null;
  }

  private _validateProvider(attributeProvider: IAccountAttributeProvider) {
    if (!attributeProvider) {
      logger.error('The attribute provider is null');
      return false
    
    } else if (!attributeProvider.setAccountAttributes) {
      logger.error('Incomplete IAttributeProvider interface: missing setAccountAttributes method');
      return false;

    } else {
      return true;
    }
  }

  getAttributeProvider(attributeProviderPath: string): IAccountAttributeProvider {
    // Sets the concrete AttributeProvider class if possible. Throws otherwise.
    const attributeProvider = this._loadProvider(attributeProviderPath);

    return attributeProvider;
  }

}
