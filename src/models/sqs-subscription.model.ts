import {model, property} from '@loopback/repository';
import {BaseEntity, NotificationType} from '.';

@model()
export class SQSSubscription extends BaseEntity {
  @property({
    type: 'string',
    required: true,
  })
  subscriptionId: string;

  @property({
    type: 'string',
    required: true,
  })
  destinationId: string;

  @property({
    type: 'string',
    required: true,
  })
  payloadVersion: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: [NotificationType.FEED_PROCESSING_FINISHED],
    },
  })
  notificationType: NotificationType;

  constructor(data?: Partial<SQSSubscription>) {
    super(data);
  }
}

export interface SQSSubscriptionRelations {
  // describe navigational properties here
}

export type SQSSubscriptionWithRelations = SQSSubscription &
  SQSSubscriptionRelations;
