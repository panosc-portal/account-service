import { bind, BindingScope, inject } from '@loopback/core';
import { User, UserInfo } from '../models';
import { UserRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { BaseService } from './base.service';
import { AttributeService } from './attribute.service';

@bind({ scope: BindingScope.SINGLETON })
export class UserService extends BaseService<User, UserRepository> {

  constructor(@repository(UserRepository) repo: UserRepository,
    @inject('services.AttributeService') private _attributeService: AttributeService) {
    super(repo);
  }

  async getOrCreateUser(userId: number, userInfo: UserInfo): Promise<User> {

    // Check for userId == 0 => user not fully integrated in the the system
    if (userId === 0) {
      return this.createUser(userId, userInfo);
    }

    let user = await this.getById(userId);
    if (user == null) {
      user = this.createUser(userId, userInfo);
    }

    // Update the user activity attributes
    user.lastSeenAt = new Date();
    if (!user.activated) {
      user.activated = true;
    }
    this.save(user);

    return user;
  }

  createUser(userId: number, userInfo: UserInfo): User {
    const user = new User({
      id: userId,
      firstName: this._attributeService.getFirstname(userInfo),
      lastName: this._attributeService.getLastname(userInfo),
      email: this._attributeService.getEmail(userInfo),
      activated: true,
      instanceQuota: 2,
      lastSeenAt: new Date()
    });

    return user;
  }
}
