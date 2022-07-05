import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {environment} from '../../environments';
import {SP_CLIENT} from '../../keys';
import {
  CreateDestinationResponse,
  CreateSubscriptionResponse,
  Destination,
  GetDestinationsResponse,
  GetSubscriptionResponse,
  NotificationType,
  SQSSubscription,
  Subscription,
} from '../../models';
import {SQSSubscriptionRepository} from '../../repositories';
import {SPClient} from '../../types';

const FEED_PROCESSING_DESTINATION = 'FeedProcessingFinished';

export class SubscriptionService {
  constructor(
    @inject(SP_CLIENT) private readonly _spClient: SPClient,
    @repository(SQSSubscriptionRepository)
    private readonly _subscriptionRepository: SQSSubscriptionRepository,
  ) {}

  async createFeedSubscription(): Promise<SQSSubscription> {
    const notificationType = NotificationType.FEED_PROCESSING_FINISHED;
    const existingSubscription = await this.findSubscriptionByType(
      notificationType,
    );
    if (existingSubscription != null) return existingSubscription;

    const destination = await this.getDestination();
    const subscription = await this.getSubscription(
      destination.destinationId,
      notificationType,
    );
    return this.saveSubscriptionRecord(subscription);
  }

  private async getDestination(): Promise<Destination> {
    const destinations = await this.getAllDestinations();
    let destination: Destination;
    if (destinations.length > 0) {
      destination = destinations.find(
        dest => dest.name === FEED_PROCESSING_DESTINATION,
      ) as Destination;
    } else {
      destination = await this.createDestination(environment.SQS_CONFIG.ARN);
    }
    return destination;
  }

  private async createDestination(
    sqsArn: string,
  ): Promise<CreateDestinationResponse> {
    return this._spClient.callAPI({
      operation: 'createDestination',
      body: {
        name: FEED_PROCESSING_DESTINATION,
        resourceSpecification: {
          sqs: {arn: sqsArn},
        },
      },
    });
  }

  private async getAllDestinations(): Promise<GetDestinationsResponse> {
    return this._spClient.callAPI({
      operation: 'getDestinations',
    });
  }

  private async getSubscription(
    destinationId: string,
    notificationType: NotificationType,
  ): Promise<Subscription> {
    let subscription: Subscription;
    const existingSubscription = await this.getSubscriptionByType(
      notificationType,
    );
    if (existingSubscription) {
      subscription = existingSubscription;
    } else {
      subscription = await this.createSubscription(
        destinationId,
        NotificationType.FEED_PROCESSING_FINISHED,
      );
    }
    return subscription;
  }

  private async getSubscriptionByType(
    type: NotificationType,
  ): Promise<GetSubscriptionResponse> {
    return this._spClient.callAPI({
      operation: 'getSubscription',
      path: {notificationType: type},
    });
  }

  private async createSubscription(
    destinationId: string,
    notificationType: NotificationType,
  ): Promise<CreateSubscriptionResponse> {
    return this._spClient.callAPI({
      operation: 'createSubscription',
      body: {
        payloadVersion: '1.0',
        destinationId: destinationId,
      },
      path: {
        notificationType: notificationType,
      },
    });
  }

  private async saveSubscriptionRecord(
    subscription: Subscription,
  ): Promise<SQSSubscription> {
    return this._subscriptionRepository.create({
      destinationId: subscription.destinationId,
      subscriptionId: subscription.subscriptionId,
      payloadVersion: subscription.payloadVersion,
      notificationType: NotificationType.FEED_PROCESSING_FINISHED,
    });
  }

  private async findSubscriptionByType(
    type: NotificationType,
  ): Promise<SQSSubscription | null> {
    return this._subscriptionRepository.findOne({
      where: {
        notificationType: type,
      },
    });
  }
}
