import { Client, expect } from '@loopback/testlab';

import { AccountServiceApplication } from '../../..';
import { setupApplication } from '../../helpers/application.helper';
import { givenInitialisedDatabase } from '../../helpers/database.helper';
import { RoleCreatorDto, RoleDto, RoleUpdatorDto } from '../../../controllers';
import { TypeORMDataSource } from '../../../datasources';

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

    const roles = res.body as RoleDto[];
    expect(roles || null).to.not.be.null();

    expect(roles.length).to.equal(2);
    roles.forEach(role => {
      expect(role.id || null).to.not.be.null();
    });
  });

  it('invokes GET /roles/{id}', async () => {
    const res = await client.get('/api/v1/roles/1').expect(200);

    const role = res.body as RoleDto;

    expect(role || null).to.not.be.null();

    expect(role.id).to.equal(1);
    expect(role.name).to.equal('admin');
    expect(role.description).to.equal('admin user role');
  });

  it('invokes POST /api/v1/roles', async () => {
    const initRes = await client.get('/api/v1/roles').expect(200);

    const initRoles = initRes.body as RoleDto[];

    const roleData = new RoleCreatorDto({ name: 'staff', description: 'staff member' });

    // Launches the POST request
    const res1 = await client
      .post('/api/v1/roles')
      .send(roleData)
      .expect(200);

    // Gets the result of the POST request
    const role = res1.body as RoleDto;
    expect(role || null).to.not.be.null();
    expect(role.id || null).to.not.be.null();

    // Checks that the number of roles has actually increased by 1
    const res2 = await client.get('/api/v1/roles').expect(200);
    const roles = res2.body as RoleDto[];
    expect(roles.length).to.equal(initRoles.length + 1);

    const res3 = await client.get(`/api/v1/roles/${role.id}`).expect(200);
    const role2 = res3.body as RoleDto;
    expect(role2 || null).to.not.be.null();
    expect(role2.id).to.equal(role.id);
    expect(role2.name).to.equal(role.name);
    expect(role2.description).to.equal(role.description);
  });

  it('invokes PUT /api/v1/roles/{:id}', async () => {
    const res = await client.get('/api/v1/roles/1').expect(200);
    const role = res.body as RoleDto;

    expect(role || null).to.not.be.null();
    expect(role.id).to.equal(1);

    const updatedRole = new RoleUpdatorDto({
      id: role.id,
      name: 'new name',
      description: 'this is new name'
    });

    const res1 = await client
      .put(`/api/v1/roles/${role.id}`)
      .send(updatedRole)
      .expect(200);

    const returnedRole = res1.body as RoleDto;
    expect(returnedRole || null).to.not.be.null();
    expect(returnedRole.id).to.equal(role.id);

    const res2 = await client.get(`/api/v1/roles/${role.id}`).expect(200);
    const role2 = res2.body as RoleDto;
    expect(role2 || null).to.not.be.null();
    expect(role2.id).to.equal(role.id);
    expect(role2.name).to.equal(updatedRole.name);
    expect(role2.description).to.equal(updatedRole.description);
  });

  it('invokes DELETE /roles/', async () => {
    await client.delete('/api/v1/roles').expect(200);

    const res = await client.get('/api/v1/roles').expect(200);

    const roles = res.body as RoleDto[];
    expect(roles.length).to.equal(0);
  });

  it('invokes DELETE /roles/{id}', async () => {
    await client.delete('/api/v1/roles/1').expect(200);

    const res = await client.get('/api/v1/roles').expect(200);

    const roles = res.body as RoleDto[];

    expect(roles || null).to.not.be.null();

    expect(roles.length).to.equal(1);

    expect(roles[0].id).to.equal(2);
    expect(roles[0].name).to.equal('user');
    expect(roles[0].description).to.equal('normal user role');
  });
});
