export class ApplicationConfig {
  database: {
    type: string;
    host: string;
    port: string;
    userName: string;
    password: string;
    name: string;
    schema: string;
    synchronize: boolean;
    logging: boolean;
  };

  logging: {
    level: string;
  };

  idp: {
    url: string;
    clientId: string;
  };

  gateway: {
    host: string;
  }

  attributeProviderPath: string;

  constructor(data?: Partial<ApplicationConfig>) {
    Object.assign(this, data);
  }
}

let applicationConfig: ApplicationConfig;

export function APPLICATION_CONFIG(): ApplicationConfig {
  if (applicationConfig == null) {
    applicationConfig = {
      database: {
        type: process.env.ACCOUNT_SERVICE_DATABASE_TYPE,
        host: process.env.ACCOUNT_SERVICE_DATABASE_HOST,
        port: process.env.ACCOUNT_SERVICE_DATABASE_PORT,
        userName: process.env.ACCOUNT_SERVICE_DATABASE_USERNAME,
        password: process.env.ACCOUNT_SERVICE_DATABASE_PASSWORD,
        name: process.env.ACCOUNT_SERVICE_DATABASE_NAME,
        schema: process.env.ACCOUNT_SERVICE_DATABASE_SCHEMA,
        synchronize: process.env.ACCOUNT_SERVICE_DATABASE_SYNCHRONIZE === 'true',
        logging: process.env.ACCOUNT_SERVICE_DATABASE_LOGGING === 'true'
      },
      logging: {
        level: process.env.ACCOUNT_SERVICE_LOG_LEVEL
      },
      idp: {
        url: process.env.ACCOUNT_SERVICE_IDP,
        clientId: process.env.ACCOUNT_SERVICE_CLIENT_ID,
      },
      gateway: {
        host: process.env.PORTAL_GATEWAY_HOST
      },
      attributeProviderPath: process.env.ACCOUNT_SERVICE_ATTRIBUTE_PROVIDER
    };
  }

  return applicationConfig;
}
