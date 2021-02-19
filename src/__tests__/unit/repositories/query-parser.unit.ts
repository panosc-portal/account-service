import { expect } from '@loopback/testlab';
import { givenInitialisedTestDatabase } from '../../helpers/database.helper';
import { createTestApplicationContext, TestApplicationContext } from '../../helpers/context.helper';
import { Query } from '../../../models';

describe('PlanRepository', () => {
  let context: TestApplicationContext;

  before('get context', async () => {
    context = createTestApplicationContext();
  });

  beforeEach('Initialise Database', givenInitialisedTestDatabase);

  it('searches users by last name equals', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'user.lastName', parameter: 'name', value: 'Murphy', comparator: '='}
      ]
    }

    const users = await context.userRepository.executeSearchQuery(query);
    expect(users.length).to.equal(1);
    expect(users[0].lastName).to.equal('Murphy');
  });


  it('searches users by last name like', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'user.lastName', parameter: 'name', value: 'Mur%', comparator: 'like'}
      ]
    }

    const users = await context.userRepository.executeSearchQuery(query);
    expect(users.length).to.equal(2);
  });

  it('searches users by lowercase last name like', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'lower(user.lastName)', parameter: 'name', value: 'mur%', comparator: 'like'}
      ]
    }

    const users = await context.userRepository.executeSearchQuery(query);
    expect(users.length).to.equal(2);
  });

  it('searches users by name and id', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'lower(user.lastName)', parameter: 'name', value: 'mur%', comparator: 'like'},
        {alias: 'user.id', parameter: 'id', value: '1002', comparator: '>', valueType: 'number'},
      ]
    }

    const users = await context.userRepository.executeSearchQuery(query);
    expect(users.length).to.equal(1);
  });

  it('searches users by role equal', async () => {
    const query: Query = {
      alias: 'user',
      join: [
        {member: 'user.roles', alias: 'role', select: true, type: 'LEFT_OUTER_JOIN'}
      ],
      filter: [
        {alias: 'role.name', parameter: 'name', value: 'STAFF', comparator: '='}
      ]
    }

    const users = await context.userRepository.executeSearchQuery(query);
    expect(users.length).to.equal(2);
  });

  it('orders by id desc', async () => {
    const query: Query = {
      alias: 'user',
      orderBy: [
        {alias: 'user.id', direction: 'DESC'}
      ]
    }

    const users = await context.userRepository.executeSearchQuery(query);
    expect(users.length).to.equal(4);
    expect(users[0].id).to.equal(1004);
  });


});
