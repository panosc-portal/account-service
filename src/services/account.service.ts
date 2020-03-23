import { bind, BindingScope } from '@loopback/core';
import { Account } from '../models';
import { AccountRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { BaseService } from './base.service';

@bind({ scope: BindingScope.SINGLETON })
export class AccountService extends BaseService<Account, AccountRepository> {
  constructor(@repository(AccountRepository) repo: AccountRepository) {
    super(repo);
  }
}
