"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const keys_1 = require("../../keys");
// import {genSalt, hash} from 'bcryptjs';
// import {UserServiceBindings, Role, Policy, User} from '../..';
// import {OPERATION_SECURITY_SPEC, SECURITY_SCHEME_SPEC} from '../../';
// import {UserRepository} from '../../repositories';
// import {UserService, RoleService, Credentials} from '../../services';
// import {TestApplication} from '../fixtures/application';
const application_1 = require("../fixtures/application");
describe('authentication', () => {
    let app;
    let client;
    let metabaseService;
    before(givenRunningApplication);
    before(() => {
        client = (0, testlab_1.createRestAppClient)(app);
    });
    after(async () => {
        await app.stop();
    });
    it(`test neeeeee`, async () => {
        const cardId = 20;
        const res = await client.get(`/card/${cardId}/query`).expect(200);
        // expect(metabaseService.sessionMb(),toJSON).to.Object();
        (0, testlab_1.expect)(res.body).to.Object();
        // console.log(result);
        // expect(result);
    });
    async function givenRunningApplication() {
        app = new application_1.TestApplication({
            rest: { ...(0, testlab_1.givenHttpServerConfig)(), port: 3002 },
        });
        await app.boot();
        metabaseService = await app.get(keys_1.MetabaseServiceBindings.METABASE);
        await app.start();
    }
});
//# sourceMappingURL=authentication.component.test.js.map