import { mapRole } from '../views/model.view';
import { printTable } from 'console-table-printer';
import { BaseCommand } from '../utils';

export default class MeCommand extends BaseCommand {
  static description = 'Obtain an authentication token';

  static examples = [`$ account-service authenticate`];

  static flags = Object.assign({}, BaseCommand.baseFlags);

  async run() {
    const { args, flags } = this.parse(MeCommand);

    this.accountServiceUrl = flags.url;

    const me = await this.authenticate(flags.token);

    console.log(me);
  }
}
