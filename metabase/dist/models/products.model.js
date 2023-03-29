"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
var productType;
(function (productType) {
    productType["SNEAKER"] = "sneaker";
    productType["SHIRT"] = "shirt";
    productType["PANT"] = "pant";
    productType["BAG"] = "bag";
})(productType || (productType = {}));
let Products = class Products extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Products.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Products.prototype, "productName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        jsonSchema: {
            enum: Object.values(productType),
        },
    }),
    tslib_1.__metadata("design:type", String)
], Products.prototype, "productType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Products.prototype, "productBrand", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], Products.prototype, "productPrice", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], Products.prototype, "productQuota", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'string',
    }),
    tslib_1.__metadata("design:type", Array)
], Products.prototype, "productImg", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        value: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Products.prototype, "productSold", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        value: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Products.prototype, "productAvailable", void 0);
Products = tslib_1.__decorate([
    (0, repository_1.model)({
    // settings: {
    //   foreignKeys: {
    //     fk_Products_usersId: {
    //       name: 'fk_Products_usersId',
    //       entity: 'Users',
    //       entityKey: 'id',
    //       foreignKey: 'usersid',
    //       onDelete: 'CASCADE',
    //       onUpdate: 'SET NULL',
    //     },
    //   },
    // },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Products);
exports.Products = Products;
//# sourceMappingURL=products.model.js.map