export type CreateDestinationResponse = Destination;
export type GetDestinationsResponse = Destination[];

export interface Destination {
  name: string;
  destinationId: string;
  resource: string;
}

export interface DestinationResource {
  sqs: SqsResource;
  eventBridge: EventBridgeResource;
}

interface SqsResource {
  arn: string;
}

interface EventBridgeResource {
  name: string;
  region: string;
  accountId: string;
}
