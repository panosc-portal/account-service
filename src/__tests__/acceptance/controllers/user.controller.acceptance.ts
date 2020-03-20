import { Client, expect } from '@loopback/testlab';
import { AccountServiceApplication } from '../../..';
import { setupApplication } from '../../helpers/application.helper';
import { givenInitialisedDatabase } from '../../helpers/database.helper';
import { TypeORMDataSource } from '../../../datasources';
import { RoleDto, UserCreatorDto, UserDto, UserUpdatorDto } from '../../../controllers';

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

    const users = res.body as UserDto[];
    expect(users || null).to.not.be.null();

    expect(users.length).to.equal(3);
    users.forEach(user => {
      expect(user.id || null).to.not.be.null();
    });
  });

  it('invokes POST /api/v1/users', async () => {
    const initRes = await client.get('/api/v1/users').expect(200);

    const initUsers = initRes.body as UserDto[];

    const userData = new UserCreatorDto({
      facilityUserId: 9999,
      username: 'billy',
      uid: 3000,
      gid: 4000,
      email: 'billy@mail.net',
      homePath: '/home/billy',
      active: true,
      roles: [1]
    });

    // Launches the POST request
    const res1 = await client
      .post('/api/v1/users')
      .send(userData)
      .expect(200);

    // Gets the result of the POST request
    const user = res1.body as UserDto;
    expect(user || null).to.not.be.null();
    expect(user.id || null).to.not.be.null();

    // Checks that the number of roles has actually increased by 1
    const res2 = await client.get('/api/v1/users').expect(200);
    const users = res2.body as UserDto[];
    expect(users.length).to.equal(initUsers.length + 1);

    const res3 = await client.get(`/api/v1/users/${user.id}`).expect(200);
    const user2 = res3.body as UserDto;
    expect(user2 || null).to.not.be.null();
    expect(user2.id).to.equal(user.id);
    expect(user2.uid).to.equal(user.uid);
    expect(user2.gid).to.equal(user.gid);
    expect(user2.username).to.equal(user.username);
    expect(user2.email).to.equal(user.email);
    expect(user2.homePath).to.equal(user.homePath);
    expect(user2.active).to.equal(user.active);
    expect(user2.roles[0].id).to.equal(user.roles[0].id);
    expect(user2.roles[0].name).to.equal(user.roles[0].name);
    expect(user2.roles[0].description).to.equal(user.roles[0].description);
  });

  it('invokes PUT /api/v1/users/{id}', async () => {
    const resRole = await client.get('/api/v1/roles/2').expect(200);
    const role = resRole.body as RoleDto;

    const res = await client.get('/api/v1/users/1').expect(200);
    const user = res.body as UserDto;
    expect(user || null).to.not.be.null();
    expect(user.id).to.equal(1);
    const newUsername = 'bobby';
    const newUid = 7000;
    const newGid = 8000;
    const newEmail = 'bobby@mail.net';
    const newHomedir = '/home/bobby';
    const newActive = false;
    const newRole = [role.id];

    const updatedUser = new UserUpdatorDto({
      id: user.id,
      facilityUserId: user.facilityUserId,
      username: newUsername,
      uid: newUid,
      gid: newGid,
      email: newEmail,
      homePath: newHomedir,
      active: newActive,
      roles: newRole
    });

    const res1 = await client
      .put(`/api/v1/users/${user.id}`)
      .send(updatedUser)
      .expect(200);
    const returnedUser = res1.body as UserDto;

    expect(returnedUser || null).to.not.be.null();
    expect(returnedUser.id).to.equal(user.id);

    const res2 = await client.get(`/api/v1/users/${user.id}`).expect(200);
    const user2 = res2.body as UserDto;
    expect(user2 || null).to.not.be.null();
    expect(user2.id).to.equal(user.id);
    expect(user2.username).to.equal('bobby');
    expect(user2.uid).to.equal(7000);
    expect(user2.gid).to.equal(8000);
    expect(user2.email).to.equal('bobby@mail.net');
    expect(user2.homePath).to.equal('/home/bobby');
    expect(user2.active).to.equal(false);
    expect(user2.roles[0].id).to.equal(2);
    expect(user2.roles[0].name).to.equal('user');
    expect(user2.roles[0].description).to.equal('normal user role');
  });

  it('invokes GET /user/{id}', async () => {
    const res = await client.get('/api/v1/users/1').expect(200);

    const user = res.body as UserDto;

    expect(user || null).to.not.be.null();

    expect(user.id).to.equal(1);
    expect(user.username).to.equal('doe');
    expect(user.uid).to.equal(1000);
    expect(user.gid).to.equal(2000);
    expect(user.email).to.equal('john.doe@mail.net');
    expect(user.homePath).to.equal('/home/doe');
    expect(user.active).to.equal(true);
  });

  it('invokes DELETE /users/', async () => {
    await client.delete('/api/v1/users').expect(200);

    const res = await client.get('/api/v1/users').expect(200);

    const users = res.body as UserDto[];

    expect(users.length).to.equal(0);
  });

  it('invokes DELETE /users/{id}', async () => {
    await client.delete('/api/v1/users/1').expect(200);

    const res = await client.get('/api/v1/users').expect(200);

    const users = res.body as UserDto[];

    expect(users || null).to.not.be.null();

    expect(users.length).to.equal(2);

    expect(users[0].id).to.equal(2);
    expect(users[0].username).to.equal('murphy');
    expect(users[0].uid).to.equal(1001);
    expect(users[0].gid).to.equal(2001);
    expect(users[0].active).to.equal(true);
    expect(users[0].email).to.equal('jane.murphy@mail.net');
    expect(users[0].homePath).to.equal('/home/murphy');

    expect(users[0].roles[0].id).to.equal(2);
    expect(users[0].roles[0].name).to.equal('user');
    expect(users[0].roles[0].description).to.equal('normal user role');
  });
});
