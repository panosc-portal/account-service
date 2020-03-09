import { User } from '../models';

export interface IAttributeProvider {
  updateFromUserInfo(user: User, userInfo: object): any;
  update(user: User): any;
}
