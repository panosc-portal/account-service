# Account Service

[![Actions Status](https://github.com/panosc-portal/account-service/workflows/Node.js%20CI/badge.svg)](https://github.com/panosc-portal/account-service/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Account Service is a micro-service of the PaNOSC Common Portal.

The main objective of the Account Service is to authenticate and authorise a user (at least the initial implementation will use OpenID Connect) and return an Account object with relevant attributes. 

The account service also provides information about the Roles of the connected user (eg to determie if they have admin rights to the portal). Authorisation and access to the these endpoints is managed by the API service (as is the case for all the other micro-services).

Different providers are necessary to obtain the account attributes as this can depend on site-specific infrastructure. For example we can have:

- account attributes passed in the authentication token (eg using keycloak)
- LDAP
- DB
- web service or other providers...

An internal API is therefore used to have an abstraction of the provider methods. An environment variable allows for the path to the concrete implementation of the attribute-provider API to be specified at runtime.

The user accounts and associated roles are all stored in a database of the Account Service.

Further documentation and the design details can be found at [PaNOSC Portal Account Service Design](https://confluence.panosc.eu/x/zwCm) page.

## Installation
```
npm install
```

## Run
```
npm start
```

### Environment variables

The following environment variables are used to configure the Account Service and can be placed in a dotenv file:

| Environment variable | Default value | Usage |
| ---- | ---- | ---- |
| ACCOUNT_SERVICE_IDP | | URL to the OpenID discovery endpoint (eg https://server.com/.well-known/openid-configuration) |
| ACCOUNT_SERVICE_CLIENT_ID | | The Client ID as configured by the OpenID provider
| ACCOUNT_SERVICE_LOGIN_FIELD | | The attribute name of the data returned by the IDP providing the login of the connected user
| ACCOUNT_SERVICE_DATABASE_TYPE | | The type of database (eg postgres) |
| ACCOUNT_SERVICE_DATABASE_HOST | | The host of the database |
| ACCOUNT_SERVICE_DATABASE_PORT | | The port of the database |
| ACCOUNT_SERVICE_DATABASE_NAME | | The database name |
| ACCOUNT_SERVICE_DATABASE_SCHEMA | | The database schema |
| ACCOUNT_SERVICE_DATABASE_USERNAME | | The database username |
| ACCOUNT_SERVICE_DATABASE_PASSWORD | | The database password |
| ACCOUNT_SERVICE_DATABASE_SYNCHRONIZE | false | Automatically generated the database structure |
| ACCOUNT_SERVICE_DATABASE_LOGGING | false | Provides detailed SQL logging |
| ACCOUNT_SERVICE_LOG_LEVEL | 'info' | Application logging level |
| ACCOUNT_SERVICE_DEFAULT_ROLE_ID | | Default ID of the role to associate to users |
| ACCOUNT_SERVICE_ATTRIBUTE_PROVIDER | | Absolute path to the attribute provider |

