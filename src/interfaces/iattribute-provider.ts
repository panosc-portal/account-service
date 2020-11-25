import { Account, UserInfo } from '../models';

export interface IAttributeProvider {
  setAccountAttributes(account: Account, userInfo?: UserInfo): any;
}
