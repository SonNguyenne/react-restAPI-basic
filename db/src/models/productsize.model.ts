import {Entity, model, property} from '@loopback/repository';
import {Products} from './products.model';
import {Size} from './size.model';

@model()
export class Productsize extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  quota: number;

  @property({
    type: 'number',
  })
  productId?: number;

  @property({
    type: 'number',
  })
  sizeId?: number;

  @property({
    type: 'number',
    value: 0,
  })
  sold?: number;

  @property({
    type: 'number',
    value: 0,
  })
  available?: number;

  constructor(data?: Partial<Productsize>) {
    super(data);
  }
}

export interface ProductsizeRelations {
  // describe navigational properties here
}

export type ProductsizeWithRelations = Productsize & ProductsizeRelations;
