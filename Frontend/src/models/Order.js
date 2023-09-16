export class Order  {
    static id = 0;
    totalAmount=0;
    customerId;
    orderItems = [];

    constructor(customer)
    {
        this.id += 1;
        this.customerId = customer
        localStorage.setItem('cart', JSON.stringify(this))
    }

}

export class OrderItem {
    articleId;
    qunatity;

    constructor(articleId, number) {
        this.articleId = articleId;
        this.qunatity = number
    }




}