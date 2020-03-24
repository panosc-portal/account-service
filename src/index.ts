import { AccountServiceApplication } from './application';
import * as dotenv from 'dotenv';
import { ApplicationConfig } from '@loopback/core';
dotenv.config();
import { logger } from './utils';

export { AccountServiceApplication };

export async function main(options: ApplicationConfig = {}) {
  const app = new AccountServiceApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  logger.info(`Server is running at ${url}`);

  return app;
}
