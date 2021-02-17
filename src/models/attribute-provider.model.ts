import { UserInfo } from "./user-info.model";

export interface IAttributeProvider {
  getUserId(userInfo: UserInfo): number;
  getUsername(userInfo: UserInfo): string;
  getUID(userInfo: UserInfo): number;
  getGID(userInfo: UserInfo): number;
  getHomePath(userInfo: UserInfo): string;
  getFirstname(userInfo: UserInfo): string;
  getLastname(userInfo: UserInfo): string;
  getEmail(userInfo: UserInfo): string;
}

export class DefaultAttributeProvider implements IAttributeProvider {
 
  constructor() {
  }
  
  getUserId(userInfo: UserInfo): number {
    throw new Error("Method not implemented.");
  }

  getUsername(userInfo: UserInfo): string {
    return userInfo.get('preferred_username')
  }

  getUID(userInfo: UserInfo): number {
    return undefined;
  }

  getGID(userInfo: UserInfo): number {
    return undefined;
  }

  getHomePath(userInfo: UserInfo): string {
    return undefined;
  }

  getFirstname(userInfo: UserInfo): string {
    return userInfo.get('given_name');
  }

  getLastname(userInfo: UserInfo): string {
    return userInfo.get('family_name');
  }

  getEmail(userInfo: UserInfo): string {
    return userInfo.get('email');
  }

}