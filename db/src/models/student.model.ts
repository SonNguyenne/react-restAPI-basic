import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'student'}}
})
export class Student extends Entity {
  @property({
    type: 'number',
    required: true,
    id: true,
    generated: true,
  })
  studentid: number;

  @property({
    type: 'string',
  })
  studentname?: string;

  @property({
    type: 'string',
  })
  studentphone?: string;

  @property({
    type: 'string',
  })
  studentclassid?: string;

  @property({
    type: 'date',
    required: true,
    postgresql: {columnName: 'created_at', dataType: 'timestamp with time zone', },
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: true,
    postgresql: {columnName: 'updated_at', dataType: 'timestamp with time zone', },
  })
  updatedAt: Date;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
