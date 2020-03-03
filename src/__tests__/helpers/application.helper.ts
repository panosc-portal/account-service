import { AccountServiceApplication } from '../..';
import { createRestAppClient, givenHttpServerConfig, Client } from '@loopback/testlab';
import { TypeORMDataSource } from '../../datasources';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new AccountServiceApplication({
    rest: restConfig,
    ignoreDotenv: true
  });

  // Stuart !!!
  //app.add(createBindingFromClass(KubernetesMockServer));

  await app.boot();
  await app.start();
  const datasource: TypeORMDataSource = await app.get('datasources.typeorm');

  const client = createRestAppClient(app);

  return { app, client, datasource };
}

export interface AppWithClient {
  app: AccountServiceApplication;
  client: Client;
  datasource: TypeORMDataSource;
}
