import { Client, expect } from '@loopback/testlab';
import { AccountServiceApplication } from '../../..';
import { setupApplication } from '../../helpers/application.helper';
import { givenInitialisedDatabase } from '../../helpers/database.helper';
import { TypeORMDataSource } from '../../../datasources';
import { Paginated, Query, User } from '../../../models';

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

  it('invokes POST /users/search for all users', async () => {
    const res = await client.post('/api/users/search').expect(200);
    const paginatedUsers = res.body as Paginated<User>;
    expect(paginatedUsers || null).to.not.be.null();

    expect(paginatedUsers.meta.count).to.equal(4);
    expect(paginatedUsers.data.length).to.equal(4);
    paginatedUsers.data.forEach(user => {
      expect(user.id || null).to.not.be.null();
    });

    // check order
    expect(paginatedUsers.data[0].lastName).to.equal('Doe');
  });

  it('invokes POST /users/search for users with last name like', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'user.lastName', parameter: 'name', value: 'Mur%', comparator: 'like'}
      ]
    }
    const res = await client.post('/api/users/search').send(query).expect(200);
    const paginatedUsers = res.body as Paginated<User>;
    expect(paginatedUsers || null).to.not.be.null();

    expect(paginatedUsers.meta.count).to.equal(2);
    expect(paginatedUsers.data.length).to.equal(2);
  });

  it('invokes POST /users/search for users with lowercase last name like', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'lower(user.lastName)', parameter: 'name', value: 'mur%', comparator: 'like'}
      ]
    }
    const res = await client.post('/api/users/search').send(query).expect(200);
    const paginatedUsers = res.body as Paginated<User>;
    expect(paginatedUsers || null).to.not.be.null();

    expect(paginatedUsers.meta.count).to.equal(2);
    expect(paginatedUsers.data.length).to.equal(2);
  });

  it('invokes POST /users/search for users by name and id', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'lower(user.lastName)', parameter: 'name', value: 'mur%', comparator: 'like'},
        {alias: 'user.id', parameter: 'id', value: '1002', comparator: '>', valueType: 'number'},
      ]
    }
    const res = await client.post('/api/users/search').send(query).expect(200);
    const paginatedUsers = res.body as Paginated<User>;
    expect(paginatedUsers || null).to.not.be.null();

    expect(paginatedUsers.meta.count).to.equal(1);
    expect(paginatedUsers.data.length).to.equal(1);
  });

  it('invokes POST /users/search for users by role equal to', async () => {
    const query: Query = {
      alias: 'user',
      join: [
        {member: 'user.roles', alias: 'role', select: true, type: 'LEFT_OUTER_JOIN'}
      ],
      filter: [
        {alias: 'role.name', parameter: 'name', value: 'STAFF', comparator: '='}
      ]
    }
    const res = await client.post('/api/users/search').send(query).expect(200);
    const paginatedUsers = res.body as Paginated<User>;
    expect(paginatedUsers || null).to.not.be.null();

    expect(paginatedUsers.meta.count).to.equal(2);
    expect(paginatedUsers.data.length).to.equal(2);
  });

  it('invokes POST /users/search orders by id desc', async () => {
    const query: Query = {
      alias: 'user',
      orderBy: [
        {alias: 'user.id', direction: 'DESC'}
      ]
    }
    const res = await client.post('/api/users/search').send(query).expect(200);
    const paginatedUsers = res.body as Paginated<User>;
    expect(paginatedUsers || null).to.not.be.null();

    expect(paginatedUsers.meta.count).to.equal(4);
    expect(paginatedUsers.data.length).to.equal(4);
    expect(paginatedUsers.data[0].id).to.equal(1004);
  });

  it('invokes POST /users/search paginates', async () => {
    const query: Query = {
      alias: 'user',
      orderBy: [
        {alias: 'user.id', direction: 'DESC'}
      ],
      pagination: {
        limit: 1, 
        offset: 1
      }
    }
    const res = await client.post('/api/users/search').send(query).expect(200);
    const paginatedUsers = res.body as Paginated<User>;
    expect(paginatedUsers.meta.count).to.equal(4);
    expect(paginatedUsers.data.length).to.equal(1);
    expect(paginatedUsers.data[0].id).to.equal(1003);
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
