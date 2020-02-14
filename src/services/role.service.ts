import { bind, BindingScope } from '@loopback/core';
import { Role } from '../models';
import { RoleRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { BaseService } from './base.service';

@bind({ scope: BindingScope.SINGLETON })
export class RoleService extends BaseService<Role, RoleRepository> {
  constructor(@repository(RoleRepository) repo: RoleRepository) {
    super(repo);
  }
}
