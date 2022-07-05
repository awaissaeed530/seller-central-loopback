import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {SQSSubscription, SQSSubscriptionWithRelations} from '../models';

export class SQSSubscriptionRepository extends DefaultCrudRepository<
  SQSSubscription,
  typeof SQSSubscription.prototype.id,
  SQSSubscriptionWithRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(SQSSubscription, dataSource);
  }
}
