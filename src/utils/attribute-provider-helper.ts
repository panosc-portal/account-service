import { APPLICATION_CONFIG } from '../application-config';
import { IAttributeProvider } from '../interfaces';
import { LoggedError } from '.';

export class AttributeProviderHelper {
  private _attributeProvider: IAttributeProvider = null;

  private _loadProvider() {
    if (this._attributeProvider == null) {
      // Fech the path to concrete implementation of IAttributeProvider from the user environment
      const attributeProviderClassPath = APPLICATION_CONFIG().misc.attribute_provider;
      // Case where a path has been defined by the user
      if (attributeProviderClassPath != null) {
        // Case of a relative path
        if (!attributeProviderClassPath.startsWith('/')) {
          throw new LoggedError('The path to attribute provider must be absolute.');
        }
        const attributeProvider = require(attributeProviderClassPath) as IAttributeProvider;
        this._validateProvider(attributeProvider);
        this._attributeProvider = attributeProvider;
      }
    }
  }

  private _validateProvider(attributeProvider: IAttributeProvider) {
    if (!attributeProvider) {
      throw new LoggedError('The attribute provider is null');
    }

    if (!attributeProvider.updateFromAccountInfo) {
      throw new LoggedError('Uncomplete IAttributeProvider interface: missing updateFromAccountInfo method');
    }

    if (!attributeProvider.update) {
      throw new LoggedError('Uncomplete IAttributeProvider interface: missing update method');
    }
  }

  getProvider() {
    // If already one available just returns
    if (this._attributeProvider) {
      return this._attributeProvider;
    }

    // Sets the concrete AttributeProvider class if possible. Throws otherwise.
    this._loadProvider();

    return this._attributeProvider;
  }
}
