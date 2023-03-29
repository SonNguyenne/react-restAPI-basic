"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFilter = exports.buildParameters = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const typeParams = {
    createdat: 'date',
    productprice: 'number',
    producttype: 'string',
};
const buildParameters = (filter) => {
    const parameters = [];
    for (const key in filter) {
        if (typeParams[key] === 'date') {
            parameters.push({
                type: 'date/single',
                target: ['variable', ['template-tag', key]],
                value: filter[key],
            });
        }
        if (typeParams[key] === 'number') {
            let val = filter[key];
            if (!Array.isArray(val)) {
                val = [val];
            }
            parameters.push({
                type: 'number/=',
                target: ['variable', ['template-tag', key]],
                value: val,
            });
        }
        if (typeParams[key] === 'string') {
            parameters.push({
                type: 'category',
                target: ['variable', ['template-tag', key]],
                value: filter[key],
            });
        }
    }
    return parameters;
};
exports.buildParameters = buildParameters;
const buildFilter = (filter, dataQuery) => {
    const filters = [];
    const { query: { breakout }, } = dataQuery;
    const field = [];
    breakout.map((val) => {
        if (val[2] && val[2]['temporal-unit']) {
            field.push(val[0], val[1], null);
        }
    });
    for (const key in filter) {
        if (lodash_1.default.has(filter[key], 'between')) {
            const [from, to] = filter[key].between;
            filters.push('between', field, from, to);
        }
        if (lodash_1.default.has(filter[key], 'gt')) {
            const [date] = filter[key].gt;
            filters.push('>', field, date);
        }
        if (lodash_1.default.has(filter[key], 'lt')) {
            const [date] = filter[key].lt;
            filters.push('<', field, date);
        }
    }
    return filters;
};
exports.buildFilter = buildFilter;
//# sourceMappingURL=metabase.js.map