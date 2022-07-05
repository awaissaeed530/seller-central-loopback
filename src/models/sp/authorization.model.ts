/* eslint-disable @typescript-eslint/naming-convention */
import {model, property} from '@loopback/repository';

export interface AmazonAuthorizationReqestDto {
  grant_type: string;
  refresh_token?: string;
  client_id: string;
  client_secret: string;
  code?: string;
  redirect_uri?: string;
}

@model()
export class AmazonAuthorizationResponseDto {
  @property({
    type: 'string',
  })
  access_token: string;

  @property({
    type: 'string',
  })
  refresh_token: string;

  @property({
    type: 'string',
  })
  token_type: string;

  @property({
    type: 'number',
  })
  expires_in: number;

  @property({
    type: 'string',
  })
  marketplaceIds: string;
}
