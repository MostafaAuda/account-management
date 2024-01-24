export class ServiceModel {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly logoUrl: string,
        public readonly theme: {
            readonly primaryColorHash: string,
        },
        public readonly links: {
            readonly website?: string,
            readonly appStore?: string,
            readonly playStore?: string,
        }
        // HINT: add more properties as needed
    ) { }


    public static fromJson(payload: any): ServiceModel {
        if(!payload) return payload;

        return new ServiceModel
            (
                payload.id,
                payload.name,
                payload.description,
                payload.logoUrl,
                {
                    primaryColorHash: payload.theme?.primaryColorHash,
                },
                {
                    website: payload.links?.website,
                    appStore: payload.links?.appStore,
                    playStore: payload.links?.playStore
                }
            );
    }
}

export class ProductModel {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly price: number,
        public readonly service: ServiceModel,
    ) {}

    
    public static fromJson(payload: any): ProductModel {
        if(!payload) return payload;
        
        return new ProductModel
            (
                payload.id,
                payload.name,
                payload.price,
                ServiceModel.fromJson(payload.service),
            );
    }
}
