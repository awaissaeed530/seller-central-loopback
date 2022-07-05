/* eslint-disable @typescript-eslint/no-explicit-any */
import {service} from '@loopback/core';
import {get} from '@loopback/openapi-v3';
import {SellerCentralService} from '../services';

export class SellerCentralController {
  constructor(
    @service(SellerCentralService)
    private sellerCentralService: SellerCentralService
  ) { }

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

  @get('/amazon/product', {
    responses: {
      '200': {
        description: 'Synchronize Amazon Central Data',
      },
    },
  })
  async uploadProduct(): Promise<any> {
    return this.sellerCentralService.createProduct();
  }
}
