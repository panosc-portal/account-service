import { Client, expect } from '@loopback/testlab';
import { AccountServiceApplication } from '../../..';
import { setupApplication } from '../../helpers/application.helper';
import { givenInitialisedDatabase } from '../../helpers/database.helper';
import { TypeORMDataSource } from '../../../datasources';
import { User } from '../../../models';

describe('UserController', () => {
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

  it('invokes GET /users', async () => {
    const res = await client.get('/api/users').expect(200);

    const users = res.body as User[];
    expect(users || null).to.not.be.null();

    expect(users.length).to.equal(4);
    users.forEach(user => {
      expect(user.id || null).to.not.be.null();
    });
  });

  it('invokes GET /users/{id}', async () => {
    const res = await client.get('/api/users/1001').expect(200);

    const user = res.body as User;
    expect(user || null).to.not.be.null();

    expect(user.id).to.equal(1001);
    expect(user.roles.length).to.equal(2);

  });

  it('invokes POST /users/{userId}/roles/{roleId}', async () => {
    const res = await client.get('/api/users/1003').expect(200);
    const user = res.body as User;
    expect(user || null).to.not.be.null();
    expect(user.roles.length).to.equal(0);

    const res2 = await client.post('/api/users/1003/roles/1').expect(200);
    
    const res3 = await client.get('/api/users/1003').expect(200);
    const user2 = res3.body as User;
    expect(user2 || null).to.not.be.null();
    expect(user2.roles.length).to.equal(1);

  });

  it('invokes DELETE /users/{userId}/roles/{roleId}', async () => {
    const res = await client.get('/api/users/1001').expect(200);
    const user = res.body as User;
    expect(user || null).to.not.be.null();
    expect(user.roles.length).to.equal(2);

    const res2 = await client.del('/api/users/1001/roles/1').expect(200);
    
    const res3 = await client.get('/api/users/1001').expect(200);
    const user2 = res3.body as User;
    expect(user2 || null).to.not.be.null();
    expect(user2.roles.length).to.equal(1);

  });


});
