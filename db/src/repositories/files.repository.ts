import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Files, FilesRelations} from '../models';

export class FilesRepository extends DefaultCrudRepository<
  Files,
  typeof Files.prototype.id,
  FilesRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Files, dataSource);
  }
}
