import { User, Role } from '../models';

export function mapRole(role: Role): any {
  return {
    Id: role.id,
    Name: role.name,
    Description: role.description
  };
}

export function mapUser(user: User): any {
  const roleNames = user.roles.map(({ name }) => name);

  return {
    Id: user.id,
    Name: `${user.firstName} ${user.lastName}`,
    Email: user.email,
    Activated: user.activated,
    Roles: roleNames
  };
}
