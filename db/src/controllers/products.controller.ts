import {inject} from '@loopback/core';
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
import {Products, Productsize, Size} from '../models';
import {securityId, SecurityBindings, UserProfile} from '@loopback/security';
import {
  ProductsizeRepository,
  ProductsRepository,
  SizeRepository,
} from '../repositories';
import {authenticate} from '@loopback/authentication';
import _ from 'lodash';
export class ProductsController {
  constructor(
    @repository(ProductsRepository)
    public productsRepository: ProductsRepository,

    @repository(ProductsizeRepository)
    public productsizeRepository: ProductsizeRepository,
    @inject(SecurityBindings.USER, {optional: true}) private user: UserProfile,

    @repository(SizeRepository) public sizeRepository: SizeRepository,
  ) {}

  @authenticate('jwt')
  @post('/products')
  @response(200, {
    description: 'Products model instance',
    content: {'application/json': {schema: getModelSchemaRef(Products)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {
            title: 'NewProducts',
            exclude: ['id', 'usersId'],
          }),
        },
      },
    })
    products: Products,
  ): Promise<Products> {
    products.usersId = Number(this.user[securityId]);

    return this.productsRepository.create(products);
  }

  @post('/products/{id}/size')
  async createSize(
    @param.path.number('id') id: typeof Products.prototype.id,
    @requestBody() productSize: Productsize,
  ): Promise<void> {
    productSize.productId = id;

    const product: any = await this.productsRepository.findById(id);
    const sizeQuota: any = await this.productsizeRepository.findOne({
      where: {productId: id},
    });
    if (sizeQuota && sizeQuota.sizeId === productSize.sizeId) {
      await this.productsizeRepository.updateById(sizeQuota.id, {
        quota: productSize.quota + sizeQuota.quota,
        available: sizeQuota.available + productSize.quota,
      });
      if (product) {
        await this.productsRepository.updateById(product.id, {
          productQuota: productSize.quota + product.productQuota,
          productAvailable: sizeQuota.available + product.productAvailable,
        });
      }
    } else {
      await this.productsRepository.updateById(product.id, {
        productQuota: productSize.quota,
        productAvailable: productSize.quota,
      });
      productSize.available = productSize.quota;

      await this.productsizeRepository.create(productSize);
    }
  }

  @post('/sizes')
  @response(200, {
    description: 'Created Size Successfully',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Size, {includeRelations: true}),
      },
    },
  })
  async size(@requestBody() size: Size): Promise<Size> {
    return this.sizeRepository.create(size);
  }

  @authenticate.skip()
  @get('/products/count')
  @response(200, {
    description: 'Products model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Products) where?: Where<Products>): Promise<Count> {
    return this.productsRepository.count(where);
  }

  @authenticate.skip()
  @get('/products')
  @response(200, {
    description: 'Array of Products model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Products, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Products) filter?: Filter<Products>,
  ): Promise<Products[]> {
    // filter = filter ?? {};
    // _.set(filter, 'order', 'productName ASC');
    return this.productsRepository.find(filter);
  }

  @authenticate.skip()
  @patch('/products')
  @response(200, {
    description: 'Products PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {partial: true}),
        },
      },
    })
    products: Products,
    @param.where(Products) where?: Where<Products>,
  ): Promise<Count> {
    return this.productsRepository.updateAll(products, where);
  }

  @authenticate.skip()
  @get('/products/{id}')
  @response(200, {
    description: 'Products model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Products, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Products, {exclude: 'where'})
    filter?: FilterExcludingWhere<Products>,
  ): Promise<Products> {
    return this.productsRepository.findById(id, filter);
  }

  @authenticate.skip()
  @patch('/products/{id}')
  @response(204, {
    description: 'Products PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {partial: true}),
        },
      },
    })
    products: Products,
  ): Promise<void> {
    await this.productsRepository.updateById(id, products);
  }

  @authenticate.skip()
  @put('/products/{id}')
  @response(204, {
    description: 'Products PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() products: Products,
  ): Promise<void> {
    await this.productsRepository.replaceById(id, products);
  }

  @authenticate.skip()
  @del('/products/{id}')
  @response(204, {
    description: 'Products DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productsRepository.deleteById(id);
  }
}
