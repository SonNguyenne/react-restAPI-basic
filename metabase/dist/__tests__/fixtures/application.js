"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestApplication = void 0;
const tslib_1 = require("tslib");
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_explorer_1 = require("@loopback/rest-explorer");
const service_proxy_1 = require("@loopback/service-proxy");
const path_1 = tslib_1.__importDefault(require("path"));
const sequence_1 = require("./sequence");
const metabase_service_1 = require("../../services/metabase.service");
const test_component_1 = require("../../test.component");
const keys_1 = require("../../keys");
require('dotenv').config();
class TestApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // - enable jwt auth -
        this.component(test_component_1.TestComponent);
        // Mount authentication system
        this.bind(keys_1.MetabaseServiceBindings.METABASE).toClass(metabase_service_1.MetabaseService);
        this.bind(keys_1.MetabaseServiceBindings.METABASE_URL).to('http://localhost:3000/api');
        this.bind(keys_1.MetabaseServiceBindings.METABASE_USERNAME).to(process.env.USERNAME_MB);
        this.bind(keys_1.MetabaseServiceBindings.METABASE_PASSWORD).to(process.env.PASSWORD_MB);
        this.component(rest_explorer_1.RestExplorerComponent);
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
exports.TestApplication = TestApplication;
//# sourceMappingURL=application.js.map