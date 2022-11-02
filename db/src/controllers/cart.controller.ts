import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Cart} from '../models';
import {CartRepository, ProductsRepository} from '../repositories';
import {securityId, SecurityBindings, UserProfile} from '@loopback/security';
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';

export class CartController {
  constructor(
    @repository(CartRepository)
    public cartRepository: CartRepository,
    @repository(ProductsRepository)
    public productsRepository: ProductsRepository,

    @inject(SecurityBindings.USER, {optional: true}) private user: UserProfile,
  ) {}

  @authenticate('jwt')
  @post('/carts')
  @response(200, {
    description: 'Cart model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cart)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {
            title: 'NewCart',
            exclude: ['id', 'usersId'],
          }),
        },
      },
    })
    cart: Omit<Cart, 'id'>,
  ): Promise<Cart> {
    let price = 0;
    let quantity = 0;
    if (cart.items) {
      await Promise.all(
        cart.items.map(async item => {
          const itm: any = await this.productsRepository.findById(
            item.productId,
          );
          price = price + itm.productPrice * item.quantity;
          quantity = quantity + item.quantity;
        }),
      );
    }
    cart.usersId = Number(this.user[securityId]);

    cart.totalQuantity = quantity;
    cart.totalPrice = price;
    return await this.cartRepository.create(cart);
  }

  @get('/carts/count')
  @response(200, {
    description: 'Cart model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Cart) where?: Where<Cart>): Promise<Count> {
    return this.cartRepository.count(where);
  }

  @get('/carts')
  @response(200, {
    description: 'Array of Cart model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cart, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Cart) filter?: Filter<Cart>): Promise<Cart[]> {
    return this.cartRepository.find(filter);
  }

  @patch('/carts')
  @response(200, {
    description: 'Cart PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {partial: true}),
        },
      },
    })
    cart: Cart,
    @param.where(Cart) where?: Where<Cart>,
  ): Promise<Count> {
    return this.cartRepository.updateAll(cart, where);
  }

  @get('/carts/{id}')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Cart, {exclude: 'where'}) filter?: FilterExcludingWhere<Cart>,
  ): Promise<Cart> {
    return this.cartRepository.findById(id, filter);
  }

  @patch('/carts/{id}')
  @response(204, {
    description: 'Cart PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {partial: true}),
        },
      },
    })
    cart: Cart,
  ): Promise<void> {
    let price = 0;
    let quantity = 0;
    if (cart.items) {
      await Promise.all(
        cart.items.map(async item => {
          const itm: any = await this.productsRepository.findById(
            item.productId,
          );
          price = price + itm.productPrice * item.quantity;
          quantity = quantity + item.quantity;
        }),
      );
    }
    console.log(price, quantity);
    cart.totalQuantity = quantity;
    cart.totalPrice = price;
    await this.cartRepository.updateById(id, cart);
  }

  @put('/carts/{id}')
  @response(204, {
    description: 'Cart PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() cart: Cart,
  ): Promise<void> {
    await this.cartRepository.replaceById(id, cart);
  }

  @del('/carts/{id}')
  @response(204, {
    description: 'Cart DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cartRepository.deleteById(id);
  }
}
