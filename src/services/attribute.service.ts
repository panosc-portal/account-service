import { bind, BindingScope, LifeCycleObserver, lifeCycleObserver } from '@loopback/core';
import { DefaultAttributeProvider, IAttributeProvider, UserInfo } from '../models';
import { LoggedError, logger } from '../utils';
import { APPLICATION_CONFIG } from '../application-config';

@bind({ scope: BindingScope.SINGLETON })
@lifeCycleObserver('service')
export class AttributeService implements LifeCycleObserver, IAttributeProvider {

  private _attributeProvider: IAttributeProvider;

  constructor() {
    this._attributeProvider = new DefaultAttributeProvider();
  }

  start(): void {
    const attributeProviderPath = APPLICATION_CONFIG().attributeProviderPath;

    const customAttributeProvider = this._loadProvider(attributeProviderPath);
    if (customAttributeProvider == null) {
      process.exit();
    
    } else {
      logger.info(`Loaded account attribute provider from path '${attributeProviderPath}'`);
      // Override functions of default attribute provider
      Object.keys(customAttributeProvider)
        .filter(key => typeof customAttributeProvider[key] === 'function')
        .forEach(key => {
          logger.info(`Overriding ${key} method of attribute provider`);
          this._attributeProvider[key] = customAttributeProvider[key];
        });

    }
  }

  getUserId(userInfo: UserInfo): number {
    return this._attributeProvider.getUserId(userInfo);
  }

  getUsername(userInfo: UserInfo): string {
    return this._attributeProvider.getUsername(userInfo);
  }

  getUID(userInfo: UserInfo): number {
    return this._attributeProvider.getUID(userInfo);
  }

  getGID(userInfo: UserInfo): number {
    return this._attributeProvider.getGID(userInfo);
  }

  getHomePath(userInfo: UserInfo): string {
    return this._attributeProvider.getHomePath(userInfo);
  }

  getFirstname(userInfo: UserInfo): string {
    return this._attributeProvider.getFirstname(userInfo);
  }

  getLastname(userInfo: UserInfo): string {
    return this._attributeProvider.getLastname(userInfo);
  }

  getEmail(userInfo: UserInfo): string {
    return this._attributeProvider.getEmail(userInfo);
  }

  private _loadProvider(attributeProviderPath: string): IAttributeProvider {
    logger.info(`Loading attribute provider with the file path '${attributeProviderPath}'`);
    if (attributeProviderPath != null) {
      try {
        let fullPath = attributeProviderPath;
        if (!attributeProviderPath.startsWith('/')) {
          fullPath = `../../${attributeProviderPath}`;
        }

        const attributeProvider = require(fullPath) as IAttributeProvider;
        if (this._validateProvider(attributeProvider)) {
          return attributeProvider;
        }

      } catch (error) {
        logger.error(`Could not load attribute provider with the file path '${attributeProviderPath}'`);
      }
    }

    return null;
  }

  private _validateProvider(attributeProvider: IAttributeProvider) {
    if (!attributeProvider) {
      logger.error('The attribute provider path has not been specified');
      return false
    
    } else if (!attributeProvider.getUserId) {
      logger.error('Incomplete IAttributeProvider interface: missing getUserId method');
      return false;

    } else {
      return true;
    }
  }

}
