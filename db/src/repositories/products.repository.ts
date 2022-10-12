import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';

import {Products, ProductsRelations, Users} from '../models';
import {UsersRepository} from './users.repository';

export class ProductsRepository extends DefaultCrudRepository<
  Products,
  typeof Products.prototype.id,
  ProductsRelations
> {
  public readonly users: BelongsToAccessor<Users, typeof Products.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UsersRepository')
    usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Products, dataSource);
    this.users = this.createBelongsToAccessorFor(
      'users',
      usersRepositoryGetter,
    );
  }
}
