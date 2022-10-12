import {UserService} from '@loopback/authentication';
import {Users} from '../models';
import {SignInCredentials} from '../models/credentials/sign-in.credentials';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {repository} from '@loopback/repository';
import {UsersRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
import {verifyPassword} from '../utils/encrypt';
import {inject, Setter} from '@loopback/core';
export class UsersService {
  constructor(
    @repository(UsersRepository) protected UsersRepository: UsersRepository,

  ) {}

  // public validatePassword(password: string) {
  //   return password.length;
  // }

  // public validateCredentials(credentials: SignInCredentials) {
  //   const invalidCredentialsErrorMessage = 'Invalid username or password.';

  //   // validate username and password
  //   if (!this.validatePassword(credentials.password)) {
  //     throw new HttpErrors.BadRequest(invalidCredentialsErrorMessage);
  //   }
  // }

  async verifyCredentials(credentials: SignInCredentials): Promise<Users> {
    // this.validateCredentials(credentials);

    const incorrectCredentialsErrorMessage = 'Incorrect username or password.';

    const foundUsers = await this.UsersRepository.findOne({
      where: {username: credentials.username},
    });

    if (foundUsers === null) {
      throw new HttpErrors.Unauthorized(incorrectCredentialsErrorMessage);
    }

    const isMatchPassword = await verifyPassword(
      credentials.password,
      foundUsers.password || '',
    );
    if (!isMatchPassword) {
      throw new HttpErrors.Unauthorized(incorrectCredentialsErrorMessage);
    }

    return foundUsers;
  }

  convertToUserProfile(users: Users): UserProfile {
    // Users always has `id` property.
    return {
      [securityId]: users.id?.toString(),
      roles: users.roles,
    };
    
  }
  
}
