import { Account, UserInfo } from '../models';

export function setAccountAttributes(account: Account, userInfo: UserInfo) {
  account.email = userInfo.get('email');
  account.uid = userInfo.get('uid') as number;
  account.gid = userInfo.get('gid') as number;
  account.homePath = userInfo.get('homeDirectory') as string;
}

