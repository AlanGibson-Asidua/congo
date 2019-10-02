import { Product } from './product';

export class BasketItem {
    constructor(
        public id: number,
        public quantity: number,
        public product: Product
    ) {}
}
