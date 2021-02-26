# Account Service

[![Actions Status](https://github.com/panosc-portal/account-service/workflows/Node.js%20CI/badge.svg)](https://github.com/panosc-portal/account-service/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Account Service is a micro-service of the PaNOSC Common Portal.

The main objective of the Account Service is to authenticate and authorise a user using OpenID Connect and returns an Account object (with related attributes such as username, home path, etc), the connected user (userId, name, etc) and associated roles (admin, staff, etc).

Access to the Account Service is made through any external REST API of the Portal (coming from API Service, Desktop Service or Notebook Service). Each of these passes the OpenID Connect token (JWT) and uses the returned roles to authorise access to their different API endpoints.

## Design

### Obtaining account attributes

In certain services, such as running Jupyter Notebook in a container, we need to provide account username, UID, GID and home path. We foresee that Keycloak can provide these for most institutes but we need to make the design open to add institute-specific modules to obtain account details.

Different providers are necessary to obtain the account attributes as this can depend on site-specific infrastructure. For example we can have:

- account attributes passed in the authentication token (eg using keycloak)
- LDAP
- DB
- web service or other providers...

An internal API is therefore used to have an abstraction of the provider methods. An environment variable allows for the path to the concrete implementation of the attribute-provider API to be specified at runtime.

#### Developing and integrating an attribute provider

To integrate and attribute provider for a facility, a simple javascript file has to be linked to the application (specified using an environmnet variable). The interface of this javascript files is as follows:

```javascript
  getUserId(userInfo): number;
  getUsername(userInfo): string;
  getUID(userInfo): number;
  getGID(userInfo): number;
  getHomePath(userInfo): string;
  getFirstname(userInfo): string;
  getLastname(userInfo): string;
  getEmail(userInfo): string;
```

The ```userInfo``` object is a wrapper to the *UserInfo Response* provided by OpenID Connect and provides a single method (```get(claim)```) to obtain *claims* returned by the service. In implementing the attribute provider this can be used as follows:

```javascript
getUserId(userInfo) {
  return userInfo.get('user_id_claim');
}
```

An example attribute provider is included in the project (in the accountAttributeProviders folder):
```javascript
const getUserId = function (userInfo) {
  return userInfo.get('the_userid_claim')
}

const getUID = function (userInfo) {
  return userInfo.get('the_uid_claim')
}

const getGID = function (userInfo) {
  return userInfo.get('the_gid_claim')
}

const getHomePath = function (userInfo) {
  return userInfo.get('the_home_directory_claim')
}

module.exports = {
  getUserId: getUserId,
  getUID: getUID,
  getGID: getGID,
  getHomePath: getHomePath
};
```

Not all attributes may come directly from OpenID Connect as mentioned previously, so connections to other databases or LDAP may be required for the full implementation.

A default attribute provider is included in the Account Service to take standard claims from the UserInfo Response. As such not all of the methods outlined above necessarily need to be implemented. The following table shows which methods can be optionally implemented and what are the default values used by the Account Service:

| Method       | Implementation | Default OIDC claim |
|--------------|----------------|--------------------|
| ```getUserId```    | Mandatory      |                    |
| ```getUsername```  | Optional       | ```preferred_username``` |
| ```getUID```       | Optional       |                    |
| ```getGID```       | Optional       |                    |
| ```getHomePath```  | Optional       |                    |
| ```getFirstname``` | Optional       | ```given_name```         |
| ```getLastname```  | Optional       | ```family_name```        |
| ```getEmail```     | Optional       | ```email```              |

### Roles

Different roles are associated to different users which can either be related to the Portal application itself or to the function of the person within the facility. Experience from VISA has given us some insights into these and are important when providing support to users:

| Role                 | Type        | Description                                                                                                                                         |
|----------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| <null>               | application | A non-existant role implies that the user is a standard user with no special functionality                                                          |
| ADMIN                | application | Has full admin rights: can manage all instances, images, flavours, plans                                                                            |
| STAKEHOLDER          | application | A stakeholder can obtain realtime figures on portal usage and long term statistical analysis of usage                                               |
| STAFF                | function    | All staff at the facility have different access rights to external users (for example for instance lifetimes or security groups)                    |
| IT_SUPPORT           | function    | Any person from the IT service can provide support to the portal users                                                                              |
| INSTRUMENT_CONTROL   | function    | Anyone who works for the instrument control service can provide support to users that are performing remote experiments                             |
| INSTRUMENT_SCIENTIST | function    | An instrument scientist (scientific staff at the facility) can provider support to anyone with an instance associated to their specific instruments |
| SCIENTIFIC_COMPUTING | function    | A scientific computing specialist can provider support to users for the data analysis software                                                      |

Given that many of these roles are associated the physical person, the data model follows that the role is associate to the User object.

### Database and extraction of user data and roles from existing facilities databases
An account table in a local database will store information about connections once a user has connected (it does not have to be pre-filled with all users for a specific institute). If the account details change in keycloak then the database is updated.

Other information is more usefully pre-loaded into the system. Concerning the roles mentioned above, this is most easily extracted from facility databases and inserted into the portal database using a separate process. At the ILL, the function roles are obtained nightly (taking into account new recrutes or position transfers) and updated in VISA accordingly. This has the advantage of separating the ILL's databases from VISA and thereby improving the security of the ILL's main database.

### User activity and instance quota
For metrics of activity of the application, we keep track of which users have been active (the activated flag is set on the first log-in) and when they last used the application (lastSeenAt).

For simple instance quota management, all users have a instanceQuota value. This can be set according to their role, for example staff users may have more than standard users.

### User search endpoint

To allow for a flexible, client-based search mechanism, the search endpoint consumes a generic Query object. The structure of this query is as follows:

```javascript
{
	alias?: string,					// 'user'
	join: [
		{
			member: string, 		// 'user.roles'
			alias: string, 			// 'role'
			type: string			  // 'LEFT_OUTER_JOIN'
		}
	],
	filter: [
		{
			alias: string,			  // 'user.lastName'
			parameter: string,		// 'name'
			value: string,			  // 'mur%'
			valueType: string,		// 'string', 'number', 'boolean', 'string[]', 'number[]', 'boolean[]'
			comparator: string		// 'like', '=', ...
		}
	],
	orderBy: [
		{
			alias: string,			  // 'user.lastName'
			direction: string		  // 'ASC', 'DESC'
		}
	],
	pagination: [
		{
			offset: number,			  // 100
			limit: number			    // 20
		}
	]
}
```

The Query structure allows for complex searches to be performed by filtering on properties of the object or properties of encapsulated objects (if a join is included). Multiple filters can be added (only AND type filtering is possible for the moment). The results can be ordered and paginated in the same was as standard SQL requests.


### Further documentation

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
| ACCOUNT_SERVICE_ATTRIBUTE_PROVIDER | | Path to the attribute provider |

