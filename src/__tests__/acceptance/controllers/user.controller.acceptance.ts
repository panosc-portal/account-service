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
    const res = await client.get('/api/v1/users').expect(200);

    const users = res.body as User[];
    expect(users || null).to.not.be.null();

    expect(users.length).to.equal(3);
    users.forEach(user => {
      expect(user.id || null).to.not.be.null();
    });
  });

  it('invokes GET /user/{id}', async () => {
    const res = await client.get('/api/v1/users/1').expect(200);

    const user = res.body as User;

    expect(user || null).to.not.be.null();

    expect(user.id).to.equal(1);
    expect(user.username).to.equal('doe');
    expect(user.uid).to.equal(1000);
    expect(user.gid).to.equal(2000);
    expect(user.email).to.equal('john.doe@mail.net');
    expect(user.homedir).to.equal('/home/doe');
    expect(user.active).to.equal(true);
  });

  it('invokes DELETE /users/', async () => {
    await client.delete('/api/v1/users').expect(200);

    const res = await client.get('/api/v1/users').expect(200);

    const users = res.body as User[];

    expect(users.length).to.equal(0);
  });

  it('invokes DELETE /users/{id}', async () => {
    await client.delete('/api/v1/users/1').expect(200);

    const res = await client.get('/api/v1/users').expect(200);

    const users = res.body as User[];

    expect(users || null).to.not.be.null();

    expect(users.length).to.equal(2);

    expect(users[0].id).to.equal(2);
    expect(users[0].username).to.equal('murphy');
    expect(users[0].uid).to.equal(1001);
    expect(users[0].gid).to.equal(2001);
    expect(users[0].active).to.equal(true);
    expect(users[0].email).to.equal('jane.murphy@mail.net');
    expect(users[0].homedir).to.equal('/home/murphy');

    expect(users[0].roles[0].id).to.equal(2);
    expect(users[0].roles[0].name).to.equal('user');
    expect(users[0].roles[0].description).to.equal('normal user role');
  });
});
