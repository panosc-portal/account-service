import { bind, BindingScope } from '@loopback/core';
import { Account } from '../models';
import { AccountRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { BaseService } from './base.service';
import { AttributeProviderHelper } from '../utils';

@bind({ scope: BindingScope.SINGLETON })
export class AccountService extends BaseService<Account, AccountRepository> {

  constructor(@repository(AccountRepository) repo: AccountRepository) {
    super(repo);
  }

  async getAccountForUsername(username: string): Promise<Account> {
    let account: Account = await this._repository.getAccountForUsername(username);

    if (account == null) {
      account = new Account({
        username: username
      });
      
      account = await this.save(account);
    }

    return account;
  }
}
