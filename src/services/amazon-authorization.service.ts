import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {AmazonAuthorizationDataSource} from '../datasources';
import {AmazonAuthorizationReqestDto, AmazonAuthorizationResponseDto} from '../models';

export interface AmazonAuthorizationService {
  getAccessToken(
    authRequest: AmazonAuthorizationReqestDto,
  ): Promise<AmazonAuthorizationResponseDto>;
}

export class AmazonAuthorizationProvider implements Provider<AmazonAuthorizationService> {
  constructor(
    @inject('datasources.AmazonAuthorization')
    protected dataSource: AmazonAuthorizationDataSource = new AmazonAuthorizationDataSource(),
  ) { }

  value(): Promise<AmazonAuthorizationService> {
    return getService(this.dataSource);
  }
}
