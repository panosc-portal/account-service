import { Account } from '../models';
import { inject } from '@loopback/core';
import { BaseRepository } from './base.repository';
import { TypeORMDataSource } from '../datasources';

export class AccountRepository extends BaseRepository<Account, number> {
  constructor(@inject('datasources.typeorm') dataSource: TypeORMDataSource) {
    super(dataSource, Account);
  }

  getAccountForUsername(username: string): Promise<Account> {
    return this.findOne({ where: { username: username } });
  }
}
