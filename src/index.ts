import { AccountServiceApplication } from './application';
import * as dotenv from 'dotenv';
import { ApplicationConfig } from '@loopback/core';
dotenv.config();
import { PanoscCommonTsComponentBindings, ILogger} from '@panosc-portal/panosc-common-ts';

export { AccountServiceApplication };

export async function main(options: ApplicationConfig = {}) {
  const app = new AccountServiceApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;

  const logger: ILogger = await app.get<ILogger>(PanoscCommonTsComponentBindings.LOGGER);
  logger.info(`Server is running at ${url}`);

  return app;
}
