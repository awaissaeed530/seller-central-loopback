export interface AmazonError {
  code: string;
  message: string;
  details: string;
}

export interface AmazonMoney {
  CurrencyCode: string;
  Amount: string;
}

export interface AmazonAddress {
  Name: string;
  AddressLine1: string;
  City: string;
  StateOrRegion: string;
  PostalCode: string;
  CountryCode: string;
  Phone: string;
}
