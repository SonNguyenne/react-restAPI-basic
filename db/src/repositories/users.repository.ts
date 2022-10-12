import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Products, Users, UsersRelations} from '../models';
import {ProductsRepository} from './products.repository';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {
  public readonly products: HasManyRepositoryFactory<
    Products,
    typeof Users.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductsRepository')
    productsRepositoryGetter: Getter<ProductsRepository>,
  ) {
    super(Users, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      productsRepositoryGetter,
    );
  }
}
