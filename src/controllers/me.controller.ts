import {get, getModelSchemaRef} from '@loopback/rest';
import {BaseController} from './base.controller';
import {User} from '../models';

export class MeController extends BaseController {
  constructor() {
    super();
  }

  @get('/api/v1/me', {
    summary: 'Authenticates a JWT token and returns a User object with Roles',
    responses: {
      '200': {
        description: 'Ok',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  me(): User {
    console.log('me');
    return new User();
  }
}
