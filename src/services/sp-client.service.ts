/* eslint-disable @typescript-eslint/naming-convention */
import {BindingScope, config, ContextTags, injectable, Provider} from '@loopback/core';
import {SP_CLIENT} from '../keys';
import {SPClient, SPClientConfig} from '../types';

@injectable({
  scope: BindingScope.TRANSIENT,
  tags: {[ContextTags.KEY]: SP_CLIENT},
})
export class SPClientProvider implements Provider<SPClient> {
  constructor(@config() private options: SPClientConfig) {
  }

  value(): SPClient {
    return new SPClient(this.options);
  }
}
