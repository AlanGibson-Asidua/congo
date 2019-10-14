export class Order {

    constructor(
        public id: number,
        public order_date: Date,
        public total: number) {}

    line_items: Array<OrderLineItem>;
}

export class OrderLineItem {

    constructor(
        public id: number,
        public quantity: number,
        public product_name: string,
        public product_category: string,
        public product_brand: string,
        public product_price: string
    ) {}
}
