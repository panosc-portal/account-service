import { AccountServiceApplication } from './application';
import * as dotenv from 'dotenv';
import { ApplicationConfig } from '@loopback/core';

dotenv.config();

export { AccountServiceApplication };

export async function main(options: ApplicationConfig = {}) {
  const app = new AccountServiceApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
