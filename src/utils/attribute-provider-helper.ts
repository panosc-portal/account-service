import { APPLICATION_CONFIG } from '../application-config';
import { LoggedError } from '.';

interface IAttributeProvider {
  updateFromUserInfo(userInfo: object): any;
  update(): any;
}

export class AttributeProviderHelper {
  private _attributeProviderHelper: IAttributeProvider = null;

  _getHelper(): IAttributeProvider {
    if (this._attributeProviderHelper == null) {
      // Fech the path to concrete implementation of IAttributeProvider from the user environment
      const attributeProviderHelperPath = APPLICATION_CONFIG().misc.attribute_provider;
      // Case where a path has been defined by the user
      if (attributeProviderHelperPath != null) {
        try {
          let fullPath = attributeProviderHelperPath;
          // Case of a relative path
          if (!attributeProviderHelperPath.startsWith('/')) {
            fullPath = `../../${attributeProviderHelperPath}`;
          }
          const attributeProviderHelper = require(fullPath) as IAttributeProvider;
          this._attributeProviderHelper = attributeProviderHelper;
        } catch (error) {
          throw new LoggedError(`Could not load AttributProvider with the file path '${attributeProviderHelperPath}'`);
        }
      }
    }

    return this._attributeProviderHelper;
  }

  _validateHelper() {
    if (!this._attributeProviderHelper.updateFromUserInfo) {
      throw new LoggedError('Uncomplete IAttributeProvider interface: missing updateFromUserInfo method');
    }

    if (!this._attributeProviderHelper.update) {
      throw new LoggedError('Uncomplete IAttributeProvider interface: missing update method');
    }

    return this._attributeProviderHelper;
  }

  getHelper() {
    // Sets the concrete AttributeProvider class if possible. Throws otherwise.
    this._getHelper();
    // Check that the user provided class respects the interface contract.
    this._validateHelper();

    return this._attributeProviderHelper;
  }
}
