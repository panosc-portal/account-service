import { testDataSource } from '../fixtures/datasources/testdb.datasource';
import { UserRepository } from '../../repositories';
import { AttributeService, UserService } from '../../services';
import {ConsoleLogger} from '@panosc-portal/panosc-common-ts';

export interface TestApplicationContext {
  userRepository: UserRepository;
  userService: UserService;
  logger: ConsoleLogger;
}

export function createTestApplicationContext(): TestApplicationContext {
  const userRepository = new UserRepository(testDataSource);
  const attributeService = new AttributeService();
  const logger = new ConsoleLogger(process.env.ACCOUNT_SERVICE_LOG_LEVEL);
  const userService = new UserService(userRepository, attributeService);

  return {
    userRepository,
    userService,
    logger
  };
}
