import { UserinfoResponse } from 'openid-client';
import { Account } from '../models';

export interface IAttributeProvider {
  setAccountAttributes(account: Account, accountInfo?: UserinfoResponse): any;
}
