import {belongsTo, Entity, hasOne, model, property} from '@loopback/repository';
import {Products} from './products.model';

enum cartStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}
@model()
export class CartItem {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'number',
  })
  productId: number;

  @property({type: 'number'})
  quantity: number;
}

@model()
export class Cart extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property.array(CartItem)
  items?: CartItem[];

  @property({type: 'number'})
  totalPrice?: number;

  @property({type: 'number'})
  totalQuantity?: number;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(cartStatus),
    },
    default: 'unpaid',
  })
  status?: cartStatus;

  @property({
    type: 'number',
  })
  usersId: number;

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
