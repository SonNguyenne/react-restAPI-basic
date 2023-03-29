"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetabaseService = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const metabase_1 = require("../utils/metabase");
const axios_1 = tslib_1.__importDefault(require("axios"));
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
let MetabaseService = class MetabaseService {
    constructor(metabaseUsername, metabasePassword, metabaseUrl) {
        this.metabaseUsername = metabaseUsername;
        this.metabasePassword = metabasePassword;
        this.metabaseUrl = metabaseUrl;
    }
    async sessionMb() {
        const response = await axios_1.default.post(`${this.metabaseUrl}/session`, {
            username: this.metabaseUsername,
            password: this.metabasePassword,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = response.data;
        return data.id;
    }
    formatNivoLine(rows) {
        const result = rows.map((row) => {
            const rests = row.slice(1, row.length - 1);
            const id = rests.join('-');
            return [row[0], id, row[row.length - 1]];
        });
        console.log(result);
        const transform = {};
        for (let i = 0; i < result.length; i++) {
            const [xValue, idValue, yValue] = result[i];
            if (!transform[idValue]) {
                transform[idValue] = { id: idValue, data: [] };
            }
            transform[idValue].data.push({ x: xValue, y: yValue });
        }
        return Object.values(transform);
    }
    formatNivoBar(data) {
        const result = data.rows.map((row) => {
            // const indexBy = {};
            const value = lodash_1.default.last(row);
            const rests = row.slice(1, row.length - 1);
            const key = rests.join('-');
            return { [data.cols[0].name]: row[0], [key]: value };
        });
        const val = [];
        result.forEach((obj) => {
            const newObj = val.find((item) => item[Object.keys(item)[0]] === obj[Object.keys(obj)[0]]);
            if (newObj) {
                newObj[Object.keys(obj)[1]] = Object.values(obj)[1];
            }
            else {
                val.push(obj);
            }
        });
        let getKeys = [];
        for (let i = 0; i < val.length; i++) {
            getKeys = getKeys.concat(Object.keys(val[i]));
        }
        const keys = getKeys
            .filter((item, index) => getKeys.indexOf(item) === index)
            .slice(1);
        return {
            indexBy: data.cols[0].name,
            keys,
            data: val,
        };
    }
    formatTrend(data) {
        const result = data.rows.map((row) => {
            const obj = {};
            for (let i = 0; i < data.cols.length; i++) {
                obj[data.cols[i].name] = row[i];
            }
            return obj;
        });
        return result;
    }
    test(URL) {
        console.log('Testing', URL);
        return 1;
    }
    async getDataByGranularity(session, filter, granularity, id) {
        const cardDetails = await axios_1.default.get(`${this.metabaseUrl}/card/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Metabase-Session': session,
            },
        });
        const { dataset_query: datasetQuery } = cardDetails.data;
        const filterDataset = (0, metabase_1.buildFilter)(filter === null || filter === void 0 ? void 0 : filter.where, datasetQuery);
        datasetQuery.query.breakout.map((val) => {
            if (val[2] && val[2]['temporal-unit']) {
                val[2]['temporal-unit'] = granularity;
            }
        });
        datasetQuery.query.filter = filterDataset;
        const response = await axios_1.default.post(`${this.metabaseUrl}/dataset`, datasetQuery, {
            headers: {
                'Content-Type': 'application/json',
                'X-Metabase-Session': session,
            },
        });
        return await response.data;
    }
    async getDataByQuery(session, parameters, id) {
        const response = await axios_1.default.post(`${this.metabaseUrl}/card/${id}/query`, { parameters }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Metabase-Session': session,
            },
        });
        return await response.data;
    }
};
MetabaseService = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.MetabaseServiceBindings.METABASE_USERNAME)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.MetabaseServiceBindings.METABASE_PASSWORD)),
    tslib_1.__param(2, (0, core_1.inject)(keys_1.MetabaseServiceBindings.METABASE_URL)),
    tslib_1.__metadata("design:paramtypes", [String, String, String])
], MetabaseService);
exports.MetabaseService = MetabaseService;
//# sourceMappingURL=metabase.service.js.map