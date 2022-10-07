import {model, property} from '@loopback/repository';
import {SignInCredentials} from './sign-in.credentials';

@model()
export class SignUpCredentials extends SignInCredentials {
  constructor(data: SignUpCredentials) {
    const {username, password} = data;
    super({username, password});
  }
}
