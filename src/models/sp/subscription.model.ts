export type CreateSubscriptionResponse = Subscription;

export interface Subscription {
  subscriptionId: string;
  payloadVersion: string;
  destinationId: string;
  processingDirective: ProcessingDirective;
}

interface ProcessingDirective {
  eventFilter: EventFilter;
}

interface EventFilter {
  aggregationSettings: AggregationSettings;
  marketplaceIds: string[];
  eventFilterType: string;
}

interface AggregationSettings {
  aggregationTimePeriod: AggregationTimePeriod;
}

enum AggregationTimePeriod {
  FiveMinutes,
  TenMinutes,
}

export enum NotificationType {
  FEED_PROCESSING_FINISHED = 'FEED_PROCESSING_FINISHED',
}
