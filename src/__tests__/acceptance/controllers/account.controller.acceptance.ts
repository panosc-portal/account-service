import { Client, expect } from '@loopback/testlab';
import { AccountServiceApplication } from '../../..';
import { setupApplication } from '../../helpers/application.helper';
import { givenInitialisedDatabase } from '../../helpers/database.helper';
import { TypeORMDataSource } from '../../../datasources';
import { AccountDto, AccountCreatorDto, AccountUpdatorDto } from '../../../controllers';

describe('AccountController', () => {
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

  it('invokes GET /accounts', async () => {
    const res = await client.get('/api/v1/accounts').expect(200);

    const accounts = res.body as AccountDto[];
    expect(accounts || null).to.not.be.null();

    expect(accounts.length).to.equal(3);
    accounts.forEach(account => {
      expect(account.id || null).to.not.be.null();
    });
  });

  it('invokes POST /api/v1/accounts', async () => {
    const initRes = await client.get('/api/v1/accounts').expect(200);

    const initAccounts = initRes.body as AccountDto[];

    const accountData = new AccountCreatorDto({
      userId: 9999,
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
      .post('/api/v1/accounts')
      .send(accountData)
      .expect(200);

    // Gets the result of the POST request
    const account = res1.body as AccountDto;
    expect(account || null).to.not.be.null();
    expect(account.id || null).to.not.be.null();

    // Checks that the number of roles has actually increased by 1
    const res2 = await client.get('/api/v1/accounts').expect(200);
    const accounts = res2.body as AccountDto[];
    expect(accounts.length).to.equal(initAccounts.length + 1);

    const res3 = await client.get(`/api/v1/accounts/${account.id}`).expect(200);
    const account2 = res3.body as AccountDto;
    expect(account2 || null).to.not.be.null();
    expect(account2.id).to.equal(account.id);
    expect(account2.uid).to.equal(account.uid);
    expect(account2.gid).to.equal(account.gid);
    expect(account2.username).to.equal(account.username);
    expect(account2.email).to.equal(account.email);
    expect(account2.homePath).to.equal(account.homePath);
    expect(account2.active).to.equal(account.active);
    expect(account2.roles[0].id).to.equal(account.roles[0].id);
    expect(account2.roles[0].name).to.equal(account.roles[0].name);
    expect(account2.roles[0].description).to.equal(account.roles[0].description);
  });

  it('invokes PUT /api/v1/accounts/{id}', async () => {
    const res = await client.get('/api/v1/accounts/1').expect(200);
    const account = res.body as AccountDto;
    expect(account || null).to.not.be.null();
    expect(account.id).to.equal(1);
    const newUsername = 'bobby';
    const newUid = 7000;
    const newGid = 8000;
    const newEmail = 'bobby@mail.net';
    const newHomedir = '/home/bobby';
    const newActive = false;

    const updatedAccount = new AccountUpdatorDto({
      id: account.id,
      userId: account.userId,
      username: newUsername,
      uid: newUid,
      gid: newGid,
      email: newEmail,
      homePath: newHomedir,
      active: newActive,
      roles: [2]
    });

    const res1 = await client
      .put(`/api/v1/accounts/${account.id}`)
      .send(updatedAccount)
      .expect(200);
    const returnedAccount = res1.body as AccountDto;

    expect(returnedAccount || null).to.not.be.null();
    expect(returnedAccount.id).to.equal(account.id);

    const res2 = await client.get(`/api/v1/accounts/${account.id}`).expect(200);
    const account2 = res2.body as AccountDto;
    expect(account2 || null).to.not.be.null();
    expect(account2.id).to.equal(account.id);
    expect(account2.username).to.equal('bobby');
    expect(account2.uid).to.equal(7000);
    expect(account2.gid).to.equal(8000);
    expect(account2.email).to.equal('bobby@mail.net');
    expect(account2.homePath).to.equal('/home/bobby');
    expect(account2.active).to.equal(false);
    expect(account2.roles[0].id).to.equal(2);
    expect(account2.roles[0].name).to.equal('user');
    expect(account2.roles[0].description).to.equal('normal user role');
  });

  it('invokes GET /account/{id}', async () => {
    const res = await client.get('/api/v1/accounts/1').expect(200);

    const account = res.body as AccountDto;

    expect(account || null).to.not.be.null();

    expect(account.id).to.equal(1);
    expect(account.username).to.equal('doe');
    expect(account.uid).to.equal(1000);
    expect(account.gid).to.equal(2000);
    expect(account.email).to.equal('john.doe@mail.net');
    expect(account.homePath).to.equal('/home/doe');
    expect(account.active).to.equal(true);
  });

});
