/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SP_CLIENT} from '../keys';
import {SPClient} from '../types';

export class SellerCentralService {
  constructor(
    @inject(SP_CLIENT) private readonly _spClient: SPClient
  ) { }

  async getCatalogItems(): Promise<any> {
    const catalog = await this._spClient.callAPI({
      operation: 'listCatalogItems',
      query: {
        MarketplaceId: "A1PA6795UKMFR9",
        SellerSKU: "EN-LUVU-TKYV"
      }
    });
    if (catalog.errors) {
      throw new HttpErrors.BadRequest('Failed to fetch catalog items');
    }
    return catalog;
  }

  async createProduct() {
    const feedDocuemnt = await this.createFeed();
    console.log(feedDocuemnt);
    const feed = {
      content: `<?xml version="1.0" encoding="iso-8859-1"?>
      <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
        <Header>
          <DocumentVersion>1.01</DocumentVersion>
          <MerchantIdentifier>ALAHBMS72DLLL</MerchantIdentifier>
        </Header>
        <MessageType>Product</MessageType>
        <PurgeAndReplace>false</PurgeAndReplace>
        <Message>
          <MessageID>1</MessageID>
          <OperationType>Create</OperationType>
          <Product>
            <SKU>56789</SKU>
            <StandardProductID>
              <Type>ASIN</Type>
              <Value>B0EXAMPLEG</Value>
            </StandardProductID>
            <ProductTaxCode>A_GEN_NOTAX</ProductTaxCode>
            <DescriptionData>
              <Title>Example Product Title</Title>
              <Brand>Example Product Brand</Brand>
              <Description>This is an example product description.</Description>
              <BulletPoint>Example Bullet Point 1</BulletPoint>
              <BulletPoint>Example Bullet Point 2</BulletPoint>
              <MSRP currency="USD">25.19</MSRP>
              <Manufacturer>Example Product Manufacturer</Manufacturer>
              <ItemType>example-item-type</ItemType>
            </DescriptionData>
            <ProductData>
              <Health>
                <ProductType>
                  <HealthMisc>
                    <Ingredients>Example Ingredients</Ingredients>
                    <Directions>Example Directions</Directions>
                  </HealthMisc>
                </ProductType>
              </Health>
            </ProductData>
          </Product>
        </Message>
      </AmazonEnvelope>`,
      contentType: 'text/xml; charset=utf-8'
    };
    const res = await this._spClient.upload({
      url: feedDocuemnt.payload?.url as string
    }, feed);
    console.log(res);
    const feedData = await this._spClient.callAPI({
      operation: 'POST_PRODUCT_DATA',
      body: {
        marketplaceIds: ['A1PA6795UKMFR9'],
        feedType: 'POST_INVENTORY_AVAILABILITY_DATA',
        inputFeedDocumentId: feedDocuemnt.payload?.feedDocumentId
      }
    });
    console.log(feedData);
  }

  private async createFeed() {
    return this._spClient.callAPI({
      operation: 'createFeedDocument',
      body: {
        contentType: 'text/xml; charset=UTF-8'
      }
    });
  }
}
