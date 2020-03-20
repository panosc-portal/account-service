import { User } from '../models';

export function updateFromUserInfo(user: User, userInfo: object) {
  user.username = userInfo['preferred_username'];
  user.email = userInfo['email'];
  user.uid = userInfo['uid'];
  user.gid = userInfo['gid'];
  user.homePath = userInfo['homeDirectory'];
  user.facilityUserId = userInfo['employeeNumber'];
}

export function update(user: User) {
  // To be implemented if updateFromUserInfo is not sufficient for feeding user
}
