import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Product extends Entity {
  @property({
    id: true,
    type: 'String',
    required: false,
    index: {unique: true},
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'string',
  })
  asin?: string;

  @property({
    type: 'string',
  })
  sku?: string;

  @property({
    type: 'object',
    postgresql: {
      dataType: 'json',
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {}

export type ProductWithRelations = Product & ProductRelations;
