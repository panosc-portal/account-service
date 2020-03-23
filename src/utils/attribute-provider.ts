import { Account } from '../models';

export function updateFromAccountInfo(account: Account, accountInfo: object) {
  account.username = accountInfo['preferred_username'];
  account.email = accountInfo['email'];
  account.uid = accountInfo['uid'];
  account.gid = accountInfo['gid'];
  account.homePath = accountInfo['homeDirectory'];
  account.userId = accountInfo['employeeNumber'];
}

export function update(account: Account) {
  // To be implemented if updateFromAccountInfo is not sufficient for feeding user
}
