import {Entity, property} from '@loopback/repository';

export class BaseEntity extends Entity {
  @property({
    id: true,
    type: 'String',
    required: false,
    index: {unique: true},
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id?: string;
}
