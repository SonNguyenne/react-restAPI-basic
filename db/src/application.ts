import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import 'reflect-metadata';
import {DbDataSource} from './datasources';
import {MySequence} from './sequence';
import {JWTService} from './services/jwt.service';
import {MetabaseService} from './services/metabase.service';
import {EmailService} from './services/sendEmail.service';
import {UploadFile} from './services/upload.service';
import {UsersService} from './services/users.service';
require('dotenv').config();
export {ApplicationConfig};

export class DbApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    //Mount authorization component
    this.component(AuthorizationComponent);

    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
    //Bind Provider
    // this.bind('provider.Authorization').toProvider(AuthorizationProvider);
    // Bind services
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind('services.UsersService').toClass(UsersService);
    this.bind('services.EmailService').toClass(EmailService);
    this.bind('services.UpLoadService').toClass(UploadFile);
    // this.bind('services.MetabaseService').toClass(MetabaseService);
    this.service(MetabaseService).toClass(MetabaseService);
  }
}
