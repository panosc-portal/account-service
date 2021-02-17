import { property } from "@loopback/repository";
import { Account } from "./entities/account.model";
import { User } from "./entities/user.model";

export class AuthenticationToken {
  @property({
    type: Account,
    required: true
  })
  account: Account;

  @property({
    type: User,
    required: true
  })
  user: User;

  constructor(data?: Partial<AuthenticationToken>) {
    Object.assign(this, data);
  }
}