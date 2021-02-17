import { bind, BindingScope, inject } from '@loopback/core';
import { Account, UserInfo } from '../models';
import { AccountRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { BaseService } from './base.service';
import { AuthenticationError } from '../utils';
import { AttributeService } from './attribute.service';

@bind({ scope: BindingScope.SINGLETON })
export class AccountService extends BaseService<Account, AccountRepository> {

  constructor(@repository(AccountRepository) repo: AccountRepository,
    @inject('services.AttributeService') private _attributeService: AttributeService) {
    super(repo);
  }

  async getAccount(userInfo: UserInfo): Promise<Account> {
    const username = this._attributeService.getUsername(userInfo);
    if (username == null) {
      throw new AuthenticationError(`Unable to obtain username`);
    }

    let account: Account = await this._repository.getAccountForUsername(username);

    if (account == null) {
      account = new Account({
        username: username
      });
    }

    // Update account atributes
    account.userId = this._attributeService.getUserId(userInfo);
    account.uid = this._attributeService.getUID(userInfo);
    account.gid = this._attributeService.getGID(userInfo);
    account.homePath = this._attributeService.getHomePath(userInfo);

    if (!account.isValid()) {
      throw new AuthenticationError(`Account does not have valid attributes`);
    }

    account = await this.save(account);

    return account;
  }
}
