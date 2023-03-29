import {inject, service} from '@loopback/core';
import {get, param, response} from '@loopback/rest';
import axios from 'axios';
import {granularity} from '../../../constants/metabase';
import {MetabaseServiceBindings} from '../../../keys';
import {Products} from '../../../models/products.model';
import {MetabaseService} from '../../../services/metabase.service';
import {buildParameters} from '../../../utils/metabase';
// Uncomment these imports t

export class MetabaseController {
  constructor(
    @inject(MetabaseServiceBindings.METABASE) public mbService: MetabaseService, // @inject('services.MetabaseService') public mbService: MetabaseService,
  ) {}

  @get('/dashboard')
  @response(200)
  async dashboard() {
    const session = await this.mbService.sessionMb();
    const response = await axios.get('http://localhost:3000/api/dashboard', {
      headers: {
        'Content-Type': 'application/json',
        'X-Metabase-Session': session,
      },
    });
    const data = response.data;
    return data;
  }

  @get('/card/{id}')
  @response(200)
  async getDataCard(
    @param.path.number('id')
    id: number,
    @param.filter(Products)
    filter?: any,
  ) {
    const parameters = buildParameters(filter?.where);
    const session = await this.mbService.sessionMb();
    const data = await this.mbService.getDataByQuery(session, parameters, id);
    return data.data;
  }

  @get('/card/{id}/query')
  @response(200)
  async getDataCardFilter(
    @param.path.number('id')
    id: number,
    @param.query.string('type')
    type?: string,
    @param.query.string('format')
    format?: string,
    @param.query.string('granularity', {
      schema: {enum: Object.values(granularity)},
    })
    granularity?: string,
    @param.filter(Products)
    filter?: any,
  ) {
    let val;
    let data;
    const session = await this.mbService.sessionMb();
    data = await this.mbService.getDataByGranularity(
      session,
      filter,
      granularity,
      id,
    );
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
}
