import { bind, BindingScope, LifeCycleObserver, lifeCycleObserver } from '@loopback/core';
import { Account, UserInfo } from '../models';
import { AccountRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { BaseService } from './base.service';
import { AccountAttributeProviderHelper, IAccountAttributeProvider } from './account-attribute-provider-helper';
import { APPLICATION_CONFIG } from '../application-config';
import { logger } from '../utils';

@bind({ scope: BindingScope.SINGLETON })
@lifeCycleObserver('service')
export class AccountService extends BaseService<Account, AccountRepository> implements LifeCycleObserver {

  private _accountAttributeProvider: IAccountAttributeProvider;

  constructor(@repository(AccountRepository) repo: AccountRepository) {
    super(repo);
  }
   
  start(): void {
    const attributeProviderPath = APPLICATION_CONFIG().misc.attribute_provider;
    const accountAttributeProviderHelper = new AccountAttributeProviderHelper();

    this._accountAttributeProvider = accountAttributeProviderHelper.getAttributeProvider(attributeProviderPath);
    if (this._accountAttributeProvider == null) {
      process.exit();
    } else {
      logger.info(`Loaded account attribute provider from path '${attributeProviderPath}'`);
    }
  }

  async getAccountForUsername(userInfo: UserInfo): Promise<Account> {
    let account: Account = await this._repository.getAccountForUsername(userInfo.username);

    if (account == null) {
      account = new Account({
        username: userInfo.username
      });
    }

    // Update account atributes from the provider
    this._accountAttributeProvider.setAccountAttributes(account, userInfo)
          
    account = await this.save(account);

    return account;
  }
}
