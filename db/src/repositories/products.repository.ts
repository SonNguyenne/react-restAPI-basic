import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {HasAndBelongsToMany} from 'loopback-datasource-juggler';
import {DbDataSource} from '../datasources';

import {Products, Productsize, ProductsRelations, Size, Users} from '../models';
import {ProductsizeRepository} from './productsize.repository';
import {SizeRepository} from './size.repository';
import {UsersRepository} from './users.repository';

export class ProductsRepository extends DefaultCrudRepository<
  Products,
  typeof Products.prototype.id,
  ProductsRelations
> {
  public readonly users: BelongsToAccessor<Users, typeof Products.prototype.id>;

  public readonly size: HasManyRepositoryFactory<
    Productsize,
    typeof Products.prototype.id
  >;

  public readonly sizes: HasManyThroughRepositoryFactory<
    Size,
    typeof Size.prototype.id,
    Productsize,
    typeof Products.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    //belongto Users
    @repository.getter('UsersRepository')
    usersRepositoryGetter: Getter<UsersRepository>,
    //hasMany Size
    @repository.getter('ProductsizeRepository')
    productsizeRepositoryGetter: Getter<ProductsizeRepository>,

    @repository.getter('sizeRepository')
    sizeRepositoryGetter: Getter<SizeRepository>,
  ) {
    super(Products, dataSource);
    //belong Users
    this.users = this.createBelongsToAccessorFor(
      'users',
      usersRepositoryGetter,
    );
    this.sizes = this.createHasManyThroughRepositoryFactoryFor(
      'sizes',
      sizeRepositoryGetter,
      productsizeRepositoryGetter,
    );

    this.registerInclusionResolver('sizes', this.sizes.inclusionResolver);
  }
}
