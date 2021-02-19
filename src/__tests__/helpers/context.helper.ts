import { testDataSource } from '../fixtures/datasources/testdb.datasource';
import { UserRepository } from '../../repositories';
import { AttributeService, UserService } from '../../services';

export interface TestApplicationContext {
  userRepository: UserRepository;
  userService: UserService;
}

export function createTestApplicationContext(): TestApplicationContext {
  const userRepository = new UserRepository(testDataSource);
  const attributeService = new AttributeService();
  const userService = new UserService(userRepository, attributeService);

  return {
    userRepository,
    userService,
  };
}
