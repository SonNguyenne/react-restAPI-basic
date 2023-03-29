"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationTags = exports.SUB_RESOURCE_ID = exports.RESOURCE_ID = exports.RefreshTokenServiceBindings = exports.RefreshTokenConstants = exports.CasbinServiceBindings = exports.MetabaseServiceBindings = exports.UserServiceBindings = exports.TokenServiceBindings = exports.TokenServiceConstants = void 0;
const core_1 = require("@loopback/core");
var TokenServiceConstants;
(function (TokenServiceConstants) {
    TokenServiceConstants.TOKEN_SECRET_VALUE = 'myjwts3cr3t';
    TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE = '21600';
})(TokenServiceConstants = exports.TokenServiceConstants || (exports.TokenServiceConstants = {}));
var TokenServiceBindings;
(function (TokenServiceBindings) {
    TokenServiceBindings.TOKEN_SECRET = core_1.BindingKey.create('authentication.jwt.secret');
    TokenServiceBindings.TOKEN_EXPIRES_IN = core_1.BindingKey.create('authentication.jwt.expires.in.seconds');
    TokenServiceBindings.TOKEN_SERVICE = core_1.BindingKey.create('services.authentication.jwt.tokenservice');
})(TokenServiceBindings = exports.TokenServiceBindings || (exports.TokenServiceBindings = {}));
var UserServiceBindings;
(function (UserServiceBindings) {
    UserServiceBindings.DATASOURCE_NAME = 'jwtdb';
    UserServiceBindings.ROLE_REPOSITORY = 'repositories.RoleRepository';
    UserServiceBindings.ROLE_MAPPING_REPOSITORY = 'repositories.RoleMappingRepository';
    UserServiceBindings.POLICY_REPOSITORY = 'repositories.PolicyRepository';
    UserServiceBindings.USER_REPOSITORY = 'repositories.UserRepository';
    UserServiceBindings.USER_CREDENTIALS_REPOSITORY = 'repositories.UserCredentialsRepository';
})(UserServiceBindings = exports.UserServiceBindings || (exports.UserServiceBindings = {}));
var MetabaseServiceBindings;
(function (MetabaseServiceBindings) {
    MetabaseServiceBindings.METABASE = 'services_metabase';
    MetabaseServiceBindings.METABASE_USERNAME = 'metabase_username';
    MetabaseServiceBindings.METABASE_PASSWORD = 'metabase_password';
    MetabaseServiceBindings.METABASE_URL = 'metabase_url';
})(MetabaseServiceBindings = exports.MetabaseServiceBindings || (exports.MetabaseServiceBindings = {}));
var CasbinServiceBindings;
(function (CasbinServiceBindings) {
    CasbinServiceBindings.DATABASE_CONNECTION_STRING = 'database_connection_string';
})(CasbinServiceBindings = exports.CasbinServiceBindings || (exports.CasbinServiceBindings = {}));
/**
 * Constant values used when generating refresh token.
 */
var RefreshTokenConstants;
(function (RefreshTokenConstants) {
    /**
     * The default secret used when generating refresh token.
     */
    RefreshTokenConstants.REFRESH_SECRET_VALUE = 'r3fr35htok3n';
    /**
     * The default expiration time for refresh token.
     */
    RefreshTokenConstants.REFRESH_EXPIRES_IN_VALUE = '216000';
    /**
     * The default issuer used when generating refresh token.
     */
    RefreshTokenConstants.REFRESH_ISSUER_VALUE = 'loopback4';
})(RefreshTokenConstants = exports.RefreshTokenConstants || (exports.RefreshTokenConstants = {}));
/**
 * Bindings related to token refresh service. The omitted explanation can be
 * found in namespace `RefreshTokenConstants`.
 */
var RefreshTokenServiceBindings;
(function (RefreshTokenServiceBindings) {
    RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE = core_1.BindingKey.create('services.authentication.jwt.refresh.tokenservice');
    RefreshTokenServiceBindings.REFRESH_SECRET = core_1.BindingKey.create('authentication.jwt.refresh.secret');
    RefreshTokenServiceBindings.REFRESH_EXPIRES_IN = core_1.BindingKey.create('authentication.jwt.refresh.expires.in.seconds');
    RefreshTokenServiceBindings.REFRESH_ISSUER = core_1.BindingKey.create('authentication.jwt.refresh.issuer');
    /**
     * The backend datasource for refresh token's persistency.
     */
    RefreshTokenServiceBindings.DATASOURCE_NAME = 'refreshdb';
    /**
     * Key for the repository that stores the refresh token and its bound user
     * information
     */
    RefreshTokenServiceBindings.REFRESH_REPOSITORY = 'repositories.RefreshTokenRepository';
})(RefreshTokenServiceBindings = exports.RefreshTokenServiceBindings || (exports.RefreshTokenServiceBindings = {}));
exports.RESOURCE_ID = core_1.BindingKey.create('resourceId');
exports.SUB_RESOURCE_ID = core_1.BindingKey.create('subResourceId');
var AuthorizationTags;
(function (AuthorizationTags) {
    AuthorizationTags.AUTHORIZER = 'authorizer';
    AuthorizationTags.CASBIN_ENFORCER = 'casbin.enforcer.factory';
    AuthorizationTags.CASBIN_PROVIDER = 'authorizationProviders.casbin-provider';
    AuthorizationTags.CASBIN_MODEL_PATH = 'authorizationProviders.casbin-model-path';
})(AuthorizationTags = exports.AuthorizationTags || (exports.AuthorizationTags = {}));
//# sourceMappingURL=keys.js.map