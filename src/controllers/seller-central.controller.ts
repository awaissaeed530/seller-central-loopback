/* eslint-disable @typescript-eslint/no-explicit-any */
import {service} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {CreateFeedResponse, Product} from '../models';
import {SellerCentralService} from '../services';

export class SellerCentralController {
  constructor(
    @service(SellerCentralService)
    private sellerCentralService: SellerCentralService,
  ) {}

  @get('/amazon/synchronize', {
    responses: {
      '200': {
        description: 'Synchronize Amazon Central Data',
      },
    },
  })
  async synchronize(): Promise<any> {
    return this.sellerCentralService.getCatalogItems();
  }

  @post('/amazon/product', {
    responses: {
      '200': {
        description: 'Success Response',
      },
    },
  })
  async uploadProduct(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'New Product',
            partial: true,
            exclude: ['id'],
          }),
        },
      },
    })
    product: Omit<Product, 'id'>,
  ): Promise<CreateFeedResponse> {
    return this.sellerCentralService.createProduct(product as Product);
  }

  @get('/amazon/feed/{id}', {
    responses: {
      '200': {
        description: 'Synchronize Amazon Central Data',
      },
    },
  })
  async getFeedById(@param.path.string('id') id: string): Promise<any> {
    return this.sellerCentralService.getFeedById(id);
  }
}
