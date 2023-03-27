import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
// import {got} from 'got';
import fetch from 'node-fetch';
import {
  Code,
  ForgotPassword,
  NewPasswordRequest,
  NewUserRequest,
  Users,
} from '../models';
import {SignInCredentials} from '../models/credentials/sign-in.credentials';
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

  @get('/users')
  @response(200, {
    description: 'Array of Posts model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Users) filter?: Filter<Users>): Promise<Users[]> {
    return this.userRepository.find(filter);
  }

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

  @get('/auth/signInFB')
  async loginFB(
    @requestBody()
    credentials: any,
  ): Promise<{facebookLoginUrl: any}> {
    const facebookLoginUrl =
      'https://www.facebook.com/v15.0/dialog/oauth?client_id=544576110809836&display=popup&redirect_uri=http://localhost:3008/login';
    return {facebookLoginUrl};
  }

  @post('/auth/signInFB/accessToken')
  async getAccessToken(
    @requestBody()
    getFbAccessToken: any,
  ): Promise<void> {
    const facebookLoginUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=544576110809836&display=popup&redirect_uri=http://localhost:3008/login&client_secret=c6f17c51afa17df0404cc0eb2d796684&code=${getFbAccessToken.code}`;
    // let accessToken: any;
    const res = await fetch(facebookLoginUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const accessToken = await res.json();

    console.log('ressss', res);

    console.log(accessToken);

    const urlAccessToken = `https://graph.facebook.com/v14.0/me?field=id,name,picture,email&access_token=${accessToken.access_token}`;

    const response = await fetch(urlAccessToken, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const profile = await response.json();

    console.log('profile', profile);
    // const fb = {fbId: profile.id, name: profile.name};
    // console.log(fb)

    // const created = await this.userRepository.create(fb);

    // console.log('created', created);
    // return {created};
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
    if (codeResetPassword.code == '') {
      throw new HttpErrors.NotAcceptable('Code is missing');
    }

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
