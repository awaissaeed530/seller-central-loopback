import SellingPartnerAPI from 'amazon-sp-api';
import {Config} from 'amazon-sp-api/lib/typings/baseTypes';

export class SPClient extends SellingPartnerAPI { }
export type SPClientConfig = Config;
