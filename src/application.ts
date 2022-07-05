import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {SQS} from 'aws-sdk';
import {
  SqsConsumerBindings,
  SqsConsumerComponent,
  SqsConsumerConfig,
} from 'loopback4-sqs-consumer';
import path from 'path';
import {environment} from './environments';
import {SP_CLIENT} from './keys';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class SellerCentralApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.sequence(MySequence);

    this.static('/', path.join(__dirname, '../public'));

    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.configure(SP_CLIENT).to(environment.SP_CONFIG);
    this.configureSQSConsumer();

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  private configureSQSConsumer() {
    const sqsConfig: SqsConsumerConfig = {
      sqs: new SQS({
        region: environment.AWS_CONFIG.REGION,
        accessKeyId: environment.AWS_CONFIG.ACCESS_KEY_ID,
        secretAccessKey: environment.AWS_CONFIG.SECRET_ACCESS_KEY,
      }),
    };
    this.configure(SqsConsumerBindings.COMPONENT).to(sqsConfig);
    this.component(SqsConsumerComponent);
  }
}
