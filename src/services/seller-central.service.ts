/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {environment} from '../environments';
import {SP_CLIENT} from '../keys';
import {
  CreateDestinationResponse,
  CreateFeedDocumentResponse,
  CreateFeedResponse,
  CreateSubscriptionResponse,
  Destination,
  GetDestinationsResponse,
  NotificationType,
  Product,
  Subscription,
} from '../models';
import {SPClient} from '../types';

const FEED_PROCESSING_DESTINATION = 'FeedProcessingFinished';

export class SellerCentralService {
  constructor(@inject(SP_CLIENT) private readonly _spClient: SPClient) {}

  async getCatalogItems(): Promise<any> {
    const catalog = await this._spClient.callAPI({
      operation: 'listCatalogItems',
      query: {
        MarketplaceId: 'A1PA6795UKMFR9',
        SellerSKU: 'EN-LUVU-TKYV',
      },
    });
    if (catalog.errors) {
      throw new HttpErrors.BadRequest('Failed to fetch catalog items');
    }
    return catalog;
  }

  async uploadProduct(product: Product) {
    const feed = this.buildFeed(product);
    const feedDocuemnt = await this.createFeedDocument(feed.contentType);
    await this._spClient.upload(feedDocuemnt, feed);
    const feedData = await this.createFeed(
      feedDocuemnt.feedDocumentId,
      'POST_PRODUCT_DATA',
    );
    return feedData;
  }

  private buildFeed(product: Product): {content: string; contentType: string} {
    return {
      content: `<?xml version="1.0" encoding="utf-8"?>
      <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
        <Header>
          <DocumentVersion>1.02</DocumentVersion>
          <MerchantIdentifier>ALAHBMS72DLLL</MerchantIdentifier>
        </Header>
        <MessageType>Product</MessageType>
        <PurgeAndReplace>false</PurgeAndReplace>
        <Message>
          <MessageID>1</MessageID>
          <OperationType>Create</OperationType>
          <Product>
            <SKU>${product.sku}</SKU>
            <StandardProductID>
              <Type>ASIN</Type>
              <Value>${product.asin}</Value>
            </StandardProductID>
            <DescriptionData>
              <Title>${product.title}</Title>
              <Brand>${product.brand}</Brand>
              <Description>${product.description}</Description>
              <MSRP currency="${product.currency}">${product.price}</MSRP>
              <Manufacturer>${product.manufacturer}</Manufacturer>
              <ItemType>${product.itemType}</ItemType>
            </DescriptionData>
          </Product>
        </Message>
      </AmazonEnvelope>`,
      contentType: 'text/xml; charset=utf-8',
    };
  }

  private async createFeedDocument(
    contentType: string,
  ): Promise<CreateFeedDocumentResponse> {
    try {
      const feedDocument = await this._spClient.callAPI({
        operation: 'feeds.createFeedDocument',
        body: {
          contentType: contentType,
        },
      });
      if (feedDocument.errors) {
        throw new HttpErrors.BadRequest(feedDocument.errors.message);
      }
      return feedDocument;
    } catch (e) {
      console.error(e);
      throw new HttpErrors.BadRequest('Failed to create Feed Document');
    }
  }

  private async createFeed(
    feedDocumentId: string,
    feedType: string,
  ): Promise<CreateFeedResponse> {
    try {
      const feed = await this._spClient.callAPI({
        operation: 'feeds.createFeed',
        body: {
          marketplaceIds: ['A1PA6795UKMFR9'],
          inputFeedDocumentId: feedDocumentId,
          feedType,
        },
      });
      if (feed.errors) {
        throw new HttpErrors.BadRequest(feed.errors.message);
      }
      return feed;
    } catch (e) {
      console.error(e);
      throw new HttpErrors.BadRequest('Failed to create Feed Document');
    }
  }

  async getFeedById(id: string) {
    return this._spClient.callAPI({
      operation: 'getFeed',
      path: {
        feedId: id,
      },
    });
  }

  async createFeedSubscription(): Promise<Subscription> {
    const destination = await this.getDestination();
    return this.createSubscription(
      destination.destinationId,
      NotificationType.FEED_PROCESSING_FINISHED,
    );
  }

  private async getDestination(): Promise<Destination> {
    const destinations = await this.getAllDestinations();
    let destination: Destination;
    if (destinations.length > 0) {
      destination = destinations.find(
        dest => dest.name === FEED_PROCESSING_DESTINATION,
      ) as Destination;
    } else {
      destination = await this.createDestination(environment.SQS_ARN);
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
}
