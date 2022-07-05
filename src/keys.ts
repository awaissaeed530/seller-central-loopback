import {BindingKey} from '@loopback/core';
import {SPClient} from './types';

export const SP_CLIENT = BindingKey.create<SPClient>('services.FileUpload',);
