import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model({settings: {strict: false}})
export class Product extends BaseEntity {
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
