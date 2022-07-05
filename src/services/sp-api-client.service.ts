/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {BindingScope, injectable} from '@loopback/context';
import SellingPartnerAPI from 'amazon-sp-api';

@injectable({scope: BindingScope.REQUEST})
export class SPAPIClientHelperService {
  private sellingPartnerClient: SellingPartnerAPI;

  public initializeSellerClient() {
    this.sellingPartnerClient = new SellingPartnerAPI({
      region: 'eu',
      refresh_token: 'Atzr|IwEBIDWKbM-l3SJbnpQNTzZBZ_gF7OOF7KHEBl7s_r3Vq0In4Kg2CYAKjYzKSqZhTcn5SEKBfQf0C_4iyq3_9HD7VIJvLtPklU3i730FMtdwdIRbYhaLmUDjhOz3LgCLBoIkylbZkXR4CTbVopH0ibU0YSQsNn5u1Gx7VuSzffnPWAA1PMnJYaf3Yfwz4XtroHA9NBVdSNXsTlFUeXv4J0cku_SN6hPRl3dw0hvR9us74r4bNX__6PDQt3g8zc7A3FFXu9HPm_snMtwjxWuvnkuVPvSN_OtP8ihRfK71HfOCZaInLSxTteOq_mcHISlV6YZc2I0',
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: 'amzn1.application-oa2-client.a1023296fa2c46128e30e357c1f2c3ac',
        SELLING_PARTNER_APP_CLIENT_SECRET: '2229926110be2cbd55671d8dcf576391ac59c4c572261f481de1c951c7cb482e',
        AWS_ACCESS_KEY_ID: 'AKIAZK6MT6IWXMAFU7MM',
        AWS_SECRET_ACCESS_KEY: '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',
        AWS_SELLING_PARTNER_ROLE: 'arn:aws:iam::641989866029:role/SP-API-Role',
      },
    });
  }

  public getSellerClient(): SellingPartnerAPI {
    return this.sellingPartnerClient;
  }
}
