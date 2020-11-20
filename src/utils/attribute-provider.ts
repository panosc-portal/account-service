import { UserinfoResponse } from 'openid-client';
import { Account } from '../models';

export function setAccountAttributes(account: Account, accountInfo: UserinfoResponse) {
  account.username = accountInfo['preferred_username'];
  account.email = accountInfo['email'];
  account.uid = accountInfo['uid'] as number;
  account.gid = accountInfo['gid'] as number;
  account.homePath = accountInfo['homeDirectory'] as string;
}

