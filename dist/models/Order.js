export class Order {
    constructor(items = []) {
        this.items = items;
    }
    addCoffee(coffee) {
        this.items.push(coffee);
    }
    total() {
        return this.items.reduce((sum, coffee) => sum + coffee.cost(), 0);
    }
}
