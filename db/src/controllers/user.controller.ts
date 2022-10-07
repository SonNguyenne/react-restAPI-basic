import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  patch,
  post,
  put,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import _ from 'lodash';
import {
  Code,
  ForgotPassword,
  NewPasswordRequest,
  NewUserRequest,
  Users,
} from '../models';
import {SignInCredentials} from '../models/credentials/sign-in.credentials';
import {SignUpCredentials} from '../models/credentials/sign-up.credentials';
import {UsersRepository} from '../repositories';
import {JWTService} from '../services/jwt.service';
import {EmailService} from '../services/sendEmail.service';
import {UsersService} from '../services/users.service';
import {encrypt} from '../utils/encrypt';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: JWTService,
    @inject('services.UsersService') public userService: UsersService,
    @inject('services.EmailService') public emailService: EmailService,
    @repository(UsersRepository) public userRepository: UsersRepository,
  ) {}

  @post('/auth/signIn')
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignInCredentials),
        },
      },
    })
    credentials: SignInCredentials,
  ): Promise<{token: any; user: Users}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);

    // const userInfo = _.omit(user, 'password') as Users;
    return {token, user};
  }

  @post('/auth/signUp')
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            exclude: ['id', 'roles', 'codeResetPassword'],
          }),
        },
      },
    })
    signUpCredentials: NewUserRequest,
  ): Promise<Users> {
    signUpCredentials.roles = ['user'];
    const user = new Users(signUpCredentials);

    // hash password
    user.password = await encrypt(signUpCredentials.password);
    // Insert new user to the database.
    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }

  @patch('/user/resetPassword')
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewPasswordRequest),
        },
      },
    })
    resetPassword: NewPasswordRequest,
  ): Promise<void> {
    const {username, password} = resetPassword;
    const user = await this.userService.verifyCredentials(resetPassword);
    if (!user) {
      throw new HttpErrors.NotFound('Username or password incorrect');
    }
    const hashNewPassword = await encrypt(resetPassword.newPassword);
    await this.userRepository.updateById(user.id, {
      password: hashNewPassword,
    });
  }

  @post('/user/forgotPassword')
  async forgetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ForgotPassword),
        },
      },
    })
    forgotPassword: ForgotPassword,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {email: forgotPassword.email},
    });

    if (!user) {
      throw new HttpErrors.NotFound('Email is not exist');
    }
    await this.emailService.sendResetPasswordMail(user);
  }

  @post('user/codeResetPassword')
  async codeResetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Code),
        },
      },
    })
    codeResetPassword: Code,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {coderesetpassword: codeResetPassword.code},
    });

    if (!user) {
      throw new HttpErrors.NotFound('Code is not correct');
    }

    const hashNewPassword = await encrypt(codeResetPassword.password);
    await this.userRepository.updateById(user.id, {
      password: hashNewPassword,
    });
  }
}
