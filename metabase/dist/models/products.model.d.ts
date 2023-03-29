import { Entity } from '@loopback/repository';
declare enum productType {
    SNEAKER = "sneaker",
    SHIRT = "shirt",
    PANT = "pant",
    BAG = "bag"
}
export declare class Products extends Entity {
    id: number;
    productName?: string;
    productType?: productType;
    productBrand?: string;
    productPrice?: number;
    productQuota?: number;
    productImg?: [];
    productSold?: number;
    productAvailable?: number;
    constructor(data?: Partial<Products>);
}
export interface ProductsRelations {
}
export type ProductsWithRelations = Products & ProductsRelations;
export {};
