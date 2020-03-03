import { User } from '../models';

export class AttributeProvider {
  private _user: User;

  constructor(user: User) {
    this._user = user;
  }
  updateFromUserInfo(userInfo: object) {
    this._user.username = userInfo['preferred_username'];
    this._user.email = userInfo['email'];
    this._user.uid = userInfo['uid'];
    this._user.gid = userInfo['gid'];
    this._user.homedir = userInfo['homeDirectory'];
  }

  update() {
    // To be implemented if updateFromUserInfo is not sufficient for feeding user
  }
}
