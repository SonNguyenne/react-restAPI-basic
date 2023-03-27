import _ from 'lodash';
import fetch from 'node-fetch';
import {buildFilter} from '../utils/metabase';

export class MetabaseService {
  session: string;

  constructor() {}

  async sessionMb(): Promise<any> {
    const response = await fetch('http://localhost:3000/api/session', {
      method: 'POST',
      body: JSON.stringify({
        username: process.env.USERNAME_MB,
        password: process.env.PASSWORD_MB,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.id;
  }

  formatNivoLine(rows: any) {
    const result = rows.map((row: any) => {
      const rests = row.slice(1, row.length - 1);
      const id = rests.join('-');

      return [row[0], id, row[row.length - 1]];
    });
    console.log(result);
    const transform: any = {};
    for (let i = 0; i < result.length; i++) {
      const [xValue, idValue, yValue] = result[i];

      if (!transform[idValue]) {
        transform[idValue] = {id: idValue, data: []};
      }
      transform[idValue].data.push({x: xValue, y: yValue});
    }

    return Object.values(transform);
  }

  formatNivoBar(data: any) {
    const result = data.rows.map((row: any) => {
      // const indexBy = {};
      const value = _.last(row);
      const rests = row.slice(1, row.length - 1);
      const key = rests.join('-');
      return {[data.cols[0].name]: row[0], [key]: value};
    });
    const val: any = [];

    result.forEach((obj: any) => {
      const newObj = val.find(
        (item: any) => item[Object.keys(item)[0]] === obj[Object.keys(obj)[0]],
      );
      if (newObj) {
        newObj[Object.keys(obj)[1]] = Object.values(obj)[1];
      } else {
        val.push(obj);
      }
    });

    let getKeys: any = [];
    for (let i = 0; i < val.length; i++) {
      getKeys = getKeys.concat(Object.keys(val[i]));
    }
    const keys = getKeys
      .filter((item: any, index: any) => getKeys.indexOf(item) === index)
      .slice(1);
    return {
      indexBy: data.cols[0].name,
      keys,
      data: val,
    };
  }

  formatTrend(data: any) {
    const result = data.rows.map((row: any) => {
      const obj: any = {};
      for (let i = 0; i < data.cols.length; i++) {
        obj[data.cols[i].name] = row[i];
      }
      return obj;
    });
    return result;
  }

  async getDataByGranularity(
    session: any,
    filter: any,
    granularity: any,
    id: number,
  ) {
    const cardDetails = await fetch(`http://localhost:3000/api/card/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Metabase-Session': session,
      },
    });
    const {dataset_query: datasetQuery} = await cardDetails.json();
    const filterDataset = buildFilter(filter?.where, datasetQuery);
    datasetQuery.query.breakout.map((val: any) => {
      if (val[2] && val[2]['temporal-unit']) {
        val[2]['temporal-unit'] = granularity;
      }
    });
    datasetQuery.query.filter = filterDataset;
    const response = await fetch(`http://localhost:3000/api/dataset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Metabase-Session': session,
      },
      body: JSON.stringify(datasetQuery),
    });
    return await response.json();
  }

  async getDataByQuery(session: any, parameters: any, id: number) {
    console.log(parameters);
    const response = await fetch(`http://localhost:3000/api/card/${id}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Metabase-Session': session,
      },
      body: JSON.stringify({parameters}),
    });
    return await response.json();
  }
}
