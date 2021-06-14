# PaNOSC Account Service CLI Client

A PaNOSC Account Service CLI client to test the Account Service APIs

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

Note: The <i>account-service</i> command is equivalent to ./bin/run

```sh-session
$ npm install
$ account-service COMMAND
running command...
$ account-service (-v|--version|version)
account-service-cli-client/1.0.0 darwin-x64 node-v10.15.3
$ account-service --help [COMMAND]
USAGE
  $ account-service COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`account-service instance:COMMAND`](#account-service-role-command)

## `account-service instance:COMMAND`

perform instance related operations

```
USAGE
  $ account-service instance:COMMAND

COMMANDS
  instance:add    Adds a role to the account service
  instance:delete Deletes a role from account service
  instance:list   List roles of the account service
```

## `account-service help [COMMAND]`

display help for account-service

```
USAGE
  $ account-service help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

<!-- commandsstop -->
