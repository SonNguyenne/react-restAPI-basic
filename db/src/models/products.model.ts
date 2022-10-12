import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Users} from './users.model';

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
  shoeName?: string;

  @property({
    type: 'string',
  })
  shoeType?: string;

  @property({
    type: 'string',
  })
  shoeSize?: number;

  @property({
    type: 'array',
    itemType: 'string',
  })
  shoeImg?: [];

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
