/* eslint-disable @typescript-eslint/naming-convention */
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {SP_CLIENT} from './keys';
import {MySequence} from './sequence';
import {SPClientConfig} from './types';

export {ApplicationConfig};

export class SellerCentralApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.configureSPClient();

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  private configureSPClient() {
    const config: SPClientConfig = {
      region: 'eu',
      refresh_token: 'Atzr|IwEBIP7-4LvRG7lTpkQcDzCEPyW-3nViX9YEgpGgDOGGAPl4qXGAy-PoIfO9mN4awvCijeNm5s0LKfNOHVd42ye5X1RgNl-nDBsqO2OM7ucVe0pXC2i45sz05Y2jGbf5iFxctmLzI1iHEdBRJX6XLFjO8Fp8WH8zsPKkUH2lZNB4AEHRw56U8a6Kg2WT6dmVskGyLTnpyIcpCcwna9HmnJTg2JFuBZr31wfFcFPTZmLONDRuRtT2Ot9DlY4ayJBTXpQYojO9LKQ_YsTgpG6qrwCW0eR5wWl9bV9QvR9NNo87jq1kEjc5A5JPfR2UU_Y_PtMH2BU',
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: 'amzn1.application-oa2-client.5cba781869184b40ac141927e4abc715',
        SELLING_PARTNER_APP_CLIENT_SECRET: '9b0256757fc079075d44b2ec72c5b0b1f0d8fd8f833ddb6307e897f0c2720f29',
        AWS_ACCESS_KEY_ID: 'AKIAZK6MT6IWXMAFU7MM',
        AWS_SECRET_ACCESS_KEY: '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',
        AWS_SELLING_PARTNER_ROLE: 'arn:aws:iam::641989866029:role/SP-API-Role',
      },
      options: {
        use_sandbox: false
      }
    };
    this.configure(SP_CLIENT).to(config);
  }
}
