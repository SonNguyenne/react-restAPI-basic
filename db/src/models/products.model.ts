import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Timestamp} from '@redis/time-series/dist/commands';
import {Productsize} from './productsize.model';
import {Size} from './size.model';
import {Users} from './users.model';

enum productType {
  SNEAKER = 'sneaker',
  SHIRT = 'shirt',
  PANT = 'pant',
  BAG = 'bag',
}

@model({
  // settings: {
  //   foreignKeys: {
  //     fk_Products_usersId: {
  //       name: 'fk_Products_usersId',
  //       entity: 'Users',
  //       entityKey: 'id',
  //       foreignKey: 'usersid',
  //       onDelete: 'CASCADE',
  //       onUpdate: 'SET NULL',
  //     },
  //   },
  // },
})
export class Products extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  productName?: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(productType),
    },
  })
  productType?: productType;

  @property({
    type: 'string',
  })
  productBrand?: string;

  @property({
    type: 'number',
  })
  productPrice?: number;

  @property({
    type: 'number',
  })
  productQuota?: number;

  // @property.array(Size)
  // productSize?: Size[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  productImg?: [];

  @hasMany(() => Size, {
    through: {model: () => Productsize, keyFrom: 'productId', keyTo: 'sizeId'},
  })
  sizes: Size[];

  @property({
    type: 'number',
    value: 0,
  })
  productSold?: number;

  @property({
    type: 'number',
    value: 0,
  })
  productAvailable?: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Timestamp;

  @belongsTo(() => Users)
  usersId: number;

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductsRelations {
  // describe navigational properties here
}

export type ProductsWithRelations = Products & ProductsRelations;
