import _ from 'lodash';
import {buildFilter} from '../utils/metabase';
import axios from 'axios';
import {inject} from '@loopback/core';
import {MetabaseServiceBindings} from '../keys';

export class MetabaseService {
  session: string;

  constructor(
    @inject(MetabaseServiceBindings.METABASE_USERNAME)
    public metabaseUsername: string,
    @inject(MetabaseServiceBindings.METABASE_PASSWORD)
    public metabasePassword: string,
    @inject(MetabaseServiceBindings.METABASE_URL) public metabaseUrl: string,
  ) {}

  async sessionMb(): Promise<any> {
    const response = await axios.post(
      `${this.metabaseUrl}/session`,
      {
        username: this.metabaseUsername,
        password: this.metabasePassword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data: any = response.data;
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

  test(URL: string) {
    console.log('Testing', URL);
    return 1;
  }

  async getDataByGranularity(
    session: any,
    filter: any,
    granularity: any,
    id: number,
  ) {
    const cardDetails = await axios.get(`${this.metabaseUrl}/card/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Metabase-Session': session,
      },
    });
    const {dataset_query: datasetQuery}: any = cardDetails.data;
    const filterDataset = buildFilter(filter?.where, datasetQuery);
    datasetQuery.query.breakout.map((val: any) => {
      if (val[2] && val[2]['temporal-unit']) {
        val[2]['temporal-unit'] = granularity;
      }
    });
    datasetQuery.query.filter = filterDataset;

    const response = await axios.post(
      `${this.metabaseUrl}/dataset`,
      datasetQuery,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Metabase-Session': session,
        },
      },
    );
    return await response.data;
  }

  async getDataByQuery(session: any, parameters: any, id: number) {
    const response = await axios.post(
      `${this.metabaseUrl}/card/${id}/query`,
      {parameters},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Metabase-Session': session,
        },
      },
    );
    return await response.data;
  }
}
