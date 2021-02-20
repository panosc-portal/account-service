import { expect } from '@loopback/testlab';
import { givenInitialisedTestDatabase } from '../../helpers/database.helper';
import { createTestApplicationContext, TestApplicationContext } from '../../helpers/context.helper';
import { Query } from '../../../models';

describe('QueryExecutor', () => {
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

    const paginatedUsers = await context.userRepository.executeSearchQuery(query);
    expect(paginatedUsers.meta.count).to.equal(1);
    expect(paginatedUsers.data.length).to.equal(1);
    expect(paginatedUsers.data[0].lastName).to.equal('Murphy');
  });

  it('searches users by last name like', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'user.lastName', parameter: 'name', value: 'Mur%', comparator: 'like'}
      ]
    }

    const paginatedUsers = await context.userRepository.executeSearchQuery(query);
    expect(paginatedUsers.meta.count).to.equal(2);
    expect(paginatedUsers.data.length).to.equal(2);
  });

  it('searches users by lowercase last name like', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'lower(user.lastName)', parameter: 'name', value: 'mur%', comparator: 'like'}
      ]
    }

    const paginatedUsers = await context.userRepository.executeSearchQuery(query);
    expect(paginatedUsers.meta.count).to.equal(2);
    expect(paginatedUsers.data.length).to.equal(2);
  });

  it('searches users by name and id', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'lower(user.lastName)', parameter: 'name', value: 'mur%', comparator: 'like'},
        {alias: 'user.id', parameter: 'id', value: '1002', comparator: '>', valueType: 'number'},
      ]
    }

    const paginatedUsers = await context.userRepository.executeSearchQuery(query);
    expect(paginatedUsers.meta.count).to.equal(1);
    expect(paginatedUsers.data.length).to.equal(1);
  });

  it('searches users by two ids', async () => {
    const query: Query = {
      alias: 'user',
      filter: [
        {alias: 'user.id', parameter: 'ids', value: '[1001, 1004]', comparator: 'IN', valueType: 'number[]'},
      ],
      orderBy: [{alias: 'user.id', direction: 'ASC'}]
    }

    const paginatedUsers = await context.userRepository.executeSearchQuery(query);
    expect(paginatedUsers.meta.count).to.equal(2);
    expect(paginatedUsers.data.length).to.equal(2);
    expect(paginatedUsers.data[0].id).to.equal(1001);
    expect(paginatedUsers.data[1].id).to.equal(1004);
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

    const paginatedUsers = await context.userRepository.executeSearchQuery(query);
    expect(paginatedUsers.meta.count).to.equal(2);
    expect(paginatedUsers.data.length).to.equal(2);
  });

  it('orders by id desc', async () => {
    const query: Query = {
      alias: 'user',
      orderBy: [
        {alias: 'user.id', direction: 'DESC'}
      ]
    }

    const paginatedUsers = await context.userRepository.executeSearchQuery(query);
    expect(paginatedUsers.meta.count).to.equal(4);
    expect(paginatedUsers.data.length).to.equal(4);
    expect(paginatedUsers.data[0].id).to.equal(1004);
  });

  it('paginates', async () => {
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

    const paginatedUsers = await context.userRepository.executeSearchQuery(query);
    expect(paginatedUsers.meta.count).to.equal(4);
    expect(paginatedUsers.data.length).to.equal(1);
    expect(paginatedUsers.data[0].id).to.equal(1003);
  });


});
