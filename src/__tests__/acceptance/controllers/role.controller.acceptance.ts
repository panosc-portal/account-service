import { Client, expect } from '@loopback/testlab';
import { AccountServiceApplication } from '../../..';
import { setupApplication } from '../../helpers/application.helper';
import { givenInitialisedDatabase } from '../../helpers/database.helper';
import { TypeORMDataSource } from '../../../datasources';
import { Role } from '../../../models';

describe('RoleController', () => {
  let app: AccountServiceApplication;
  let client: Client;
  let datasource: TypeORMDataSource;

  before('setupApplication', async () => {
    ({ app, client, datasource } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  beforeEach('Initialise Database', function() {
    return givenInitialisedDatabase(datasource);
  });

  it('invokes GET /roles', async () => {
    const res = await client.get('/api/v1/roles').expect(200);

    const roles = res.body as Role[];
    expect(roles || null).to.not.be.null();

    expect(roles.length).to.equal(2);
    roles.forEach(role => {
      expect(role.id || null).to.not.be.null();
    });
  });

  it('invokes GET /roles/{id}', async () => {
    const res = await client.get('/api/v1/roles/1').expect(200);

    const role = res.body as Role;

    expect(role || null).to.not.be.null();

    expect(role.id).to.equal(1);
    expect(role.name).to.equal('admin');
    expect(role.description).to.equal('admin user role');
  });

  it('invokes DELETE /roles/', async () => {
    const res = await client.delete('/api/v1/roles').expect(200);

    const roles = res.body as Role[];
    expect(roles.length).to.equal(0);
  });

  it('invokes DELETE /roles/{id}', async () => {
    const res = await client.delete('/api/v1/roles/1').expect(200);

    const roles = res.body as Role[];

    expect(roles || null).to.not.be.null();

    expect(roles.length).to.equal(1);

    expect(roles[0].id).to.equal(2);
    expect(roles[0].name).to.equal('user');
    expect(roles[0].description).to.equal('normal user role');
  });
});
