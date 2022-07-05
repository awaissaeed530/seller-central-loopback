import {Provider} from '@loopback/core';
import {consumeQueue, SqsSubscriber} from 'loopback4-sqs-consumer';
import {environment} from '../../environments';

@consumeQueue({
  queueUrl: environment.SQS_CONFIG.URL,
})
export class NotificationsQueueProvider implements Provider<SqsSubscriber> {
  constructor() {}

  async value() {
    return this.action.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async action(message: any) {
    console.log('action', message);
  }
}
