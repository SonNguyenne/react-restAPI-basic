import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Products, Productsize, ProductsizeRelations} from '../models';

export class ProductsizeRepository extends DefaultCrudRepository<
  Productsize,
  typeof Productsize.prototype.id,
  ProductsizeRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Productsize, dataSource);
  }
}
