"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetabaseController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const axios_1 = tslib_1.__importDefault(require("axios"));
const metabase_1 = require("../../../constants/metabase");
const keys_1 = require("../../../keys");
const products_model_1 = require("../../../models/products.model");
const metabase_service_1 = require("../../../services/metabase.service");
const metabase_2 = require("../../../utils/metabase");
// Uncomment these imports t
let MetabaseController = class MetabaseController {
    constructor(mbService) {
        this.mbService = mbService;
    }
    async dashboard() {
        const session = await this.mbService.sessionMb();
        const response = await axios_1.default.get('http://localhost:3000/api/dashboard', {
            headers: {
                'Content-Type': 'application/json',
                'X-Metabase-Session': session,
            },
        });
        const data = response.data;
        return data;
    }
    async getDataCard(id, filter) {
        const parameters = (0, metabase_2.buildParameters)(filter === null || filter === void 0 ? void 0 : filter.where);
        const session = await this.mbService.sessionMb();
        const data = await this.mbService.getDataByQuery(session, parameters, id);
        return data.data;
    }
    async getDataCardFilter(id, type, format, granularity, filter) {
        let val;
        let data;
        const session = await this.mbService.sessionMb();
        data = await this.mbService.getDataByGranularity(session, filter, granularity, id);
        switch (type) {
            case 'nivo':
                switch (format) {
                    case 'line':
                        val = this.mbService.formatNivoLine(data.data.rows);
                        break;
                    case 'bar':
                        val = this.mbService.formatNivoBar(data.data);
                }
                break;
            case 'trend':
                val = this.mbService.formatTrend(data.data);
                break;
            default:
                val = data.data;
        }
        return val;
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/dashboard'),
    (0, rest_1.response)(200),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MetabaseController.prototype, "dashboard", null);
tslib_1.__decorate([
    (0, rest_1.get)('/card/{id}'),
    (0, rest_1.response)(200),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.filter(products_model_1.Products)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MetabaseController.prototype, "getDataCard", null);
tslib_1.__decorate([
    (0, rest_1.get)('/card/{id}/query'),
    (0, rest_1.response)(200),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.query.string('type')),
    tslib_1.__param(2, rest_1.param.query.string('format')),
    tslib_1.__param(3, rest_1.param.query.string('granularity', {
        schema: { enum: Object.values(metabase_1.granularity) },
    })),
    tslib_1.__param(4, rest_1.param.filter(products_model_1.Products)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MetabaseController.prototype, "getDataCardFilter", null);
MetabaseController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.MetabaseServiceBindings.METABASE)),
    tslib_1.__metadata("design:paramtypes", [metabase_service_1.MetabaseService])
], MetabaseController);
exports.MetabaseController = MetabaseController;
//# sourceMappingURL=metabase.controller.js.map