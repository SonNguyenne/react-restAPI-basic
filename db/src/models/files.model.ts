import {Entity, model, property} from '@loopback/repository';

@model()
export class Files extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  bucket?: string;

  @property({
    type: 'string',
  })
  name?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Files>) {
    super(data);
  }
}

export interface FilesRelations {
  // describe navigational properties here
}

export type FilesWithRelations = Files & FilesRelations;
