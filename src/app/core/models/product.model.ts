export class ProductModel {
  constructor(
    public id: string,
    public name: string,
    public serviceType: string,
    public description: string,
    public logo: string,
    public websiteUrl: string,
    public playStoreUrl: string,
    public appStoreUrl: string,
    public huaweiStoreUrl: string,
    public playStoreBarcode: string,
    public appStoreBarcode: string,
    public huaweiStoreBarcode: string,
    public productsImagesDto: ProductsDTOModel[],
    public subscriptionsCount: number
  ) {}

  public static fromJson(payload: any): ProductModel {
    return new ProductModel(
      payload.id,
      payload.name,
      payload.serviceType,
      payload.description,
      payload.logo,
      payload.websiteUrl,
      payload.playStoreUrl,
      payload.appStoreUrl,
      payload.huaweiStoreUrl,
      payload.playStoreBarcode,
      payload.appStoreBarcode,
      payload.huaweiStoreBarcode,
      payload.productsImagesDto,
      payload.subscriptionsCount
    );
  }
}

export class ProductsDTOModel {
  constructor(
    public imageId: string,
    public image: string,
    public title: string,
    public tag: string
  ) {}
}
