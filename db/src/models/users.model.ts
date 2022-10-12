import {Entity, hasMany, model, property} from '@loopback/repository';
import {Products} from './products.model';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'users'},
  },
})
export class Users extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    hidden: true,
  })
  password?: string;

  @property({
    type: 'string',
  })
  phonenumber?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  fullName?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @property({
    type: 'string',
  })
  codeResetPassword?: string;

  @hasMany(() => Products)
  products: Products[];

  [prop: string]: any;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

@model()
export class NewUserRequest extends Users {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

@model()
export class NewPasswordRequest {
  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  newPassword: string;
}

@model()
export class ForgotPassword {
  @property({
    type: 'string',
    required: true,
  })
  email: string;
}

@model()
export class Code {
  @property({
    type: 'string',
    required: true,
  })
  code: string;
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
