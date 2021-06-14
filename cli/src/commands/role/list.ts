import { mapRole } from '../../views/model.view';
import { printTable } from 'console-table-printer';
import { BaseCommand } from '../../utils';

export default class RoleListCommand extends BaseCommand {
  static description = 'List roles of the account service';

  static examples = [`$ account-service role:list`];

  static flags = Object.assign({}, BaseCommand.baseFlags);

  async run() {
    const { args, flags } = this.parse(RoleListCommand);

    this.accountServiceUrl = flags.url;

    const roles = await this.getRoles();

    if (roles.length > 0) {
      const roleTableData = roles.map(role => mapRole(role));

      printTable(roleTableData);
    } else {
      console.log('The role database is empty.');
    }
  }
}
