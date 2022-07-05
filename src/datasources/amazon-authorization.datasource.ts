import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'AmazonAuthorization',
  connector: 'rest',
  baseURL: 'https://api.amazon.com/auth',
  crud: false,
  operations: [
    {
      template: {
        method: 'POST',
        url: 'https://api.amazon.com/auth/o2/token',
        form: '{authRequest}',
      },
      functions: {
        getAccessToken: ['authRequest'],
      },
    },
  ],
};

@lifeCycleObserver('datasource')
export class AmazonAuthorizationDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'AmazonAuthorization';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.AmazonAuthorization', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
