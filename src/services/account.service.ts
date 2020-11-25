import { bind, BindingScope } from '@loopback/core';
import { Account, UserInfo } from '../models';
import { AccountRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { BaseService } from './base.service';
import { AttributeProviderHelper } from '../utils';

@bind({ scope: BindingScope.SINGLETON })
export class AccountService extends BaseService<Account, AccountRepository> {

  private _attributeProviderHelper: AttributeProviderHelper = new AttributeProviderHelper();

  constructor(@repository(AccountRepository) repo: AccountRepository) {
    super(repo);
  }

  async getAccountForUsername(userInfo: UserInfo): Promise<Account> {
    let account: Account = await this._repository.getAccountForUsername(userInfo.username);

    if (account == null) {
      account = new Account({
        username: userInfo.username
      });
    }

    // Update account atributes from the provider
    this._attributeProviderHelper.setAccountAttributes(account, userInfo)
          
    account = await this.save(account);

    return account;
  }
}
