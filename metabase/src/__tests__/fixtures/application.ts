// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {AuthenticationComponent} from '@loopback/authentication';
import {AuthorizationComponent} from '@loopback/authorization';
import {DbDataSource} from './datasources/db.datasource';
import {MySequence} from './sequence';
import {MetabaseService} from '../../services/metabase.service';
import {TestComponent} from '../../test.component';
import {MetabaseServiceBindings} from '../../keys';
require('dotenv').config();

export class TestApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // - enable jwt auth -
    this.component(TestComponent);
    // Mount authentication system
    this.bind(MetabaseServiceBindings.METABASE).toClass(MetabaseService);
    this.bind(MetabaseServiceBindings.METABASE_URL).to(
      'http://localhost:3000/api',
    );
    this.bind(MetabaseServiceBindings.METABASE_USERNAME).to(
      process.env.USERNAME_MB,
    );
    this.bind(MetabaseServiceBindings.METABASE_PASSWORD).to(
      process.env.PASSWORD_MB,
    );

    this.component(RestExplorerComponent);
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      repositories: {
        dirs: ['repositories'],
        extensions: ['.repository.js'],
        nested: true,
      },
    };
  }
}
