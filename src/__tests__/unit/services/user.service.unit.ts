import { expect } from '@loopback/testlab';
import { givenInitialisedTestDatabase, closeTestDatabase } from '../../helpers/database.helper';
import { createTestApplicationContext, TestApplicationContext } from '../../helpers/context.helper';

describe('UserService', () => {
  let context: TestApplicationContext;

  before('get context', async () => {
    context = createTestApplicationContext();
  });

  after('close db connect', closeTestDatabase);

  beforeEach('Initialise Database', givenInitialisedTestDatabase);

  it('gets all users', async () => {
    const users = await context.userService.getAll();
    expect(users.length).to.equal(4);
  });

  it('gets a user', async () => {
    const user = await context.userService.getById(1001);

    expect(user || null).to.not.be.null();
    expect(user.email).to.equal('john.doe@mail.net');
  });


});
