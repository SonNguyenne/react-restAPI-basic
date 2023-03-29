import _ from 'lodash';

const typeParams: any = {
  createdat: 'date',
  productprice: 'number',
  producttype: 'string',
};
export const buildParameters = (filter: any) => {
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

export const buildFilter = (filter: any, dataQuery: any) => {
  const filters = [];
  const {
    query: {breakout},
  } = dataQuery;
  const field: any = [];
  breakout.map((val: any) => {
    if (val[2] && val[2]['temporal-unit']) {
      field.push(val[0], val[1], null);
    }
  });

  for (const key in filter) {
    if (_.has(filter[key], 'between')) {
      const [from, to] = filter[key].between;
      filters.push('between', field, from, to);
    }
    if (_.has(filter[key], 'gt')) {
      const [date] = filter[key].gt;
      filters.push('>', field, date);
    }
    if (_.has(filter[key], 'lt')) {
      const [date] = filter[key].lt;

      filters.push('<', field, date);
    }
  }
  return filters;
};
