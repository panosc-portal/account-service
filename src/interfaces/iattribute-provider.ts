import { Account } from '../models';

export interface IAttributeProvider {
  updateFromAccountInfo(account: Account, accountInfo: object): any;
  update(account: Account): any;
}
