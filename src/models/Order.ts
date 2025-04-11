import { Coffee } from "./Coffee.js";

export class Order {
  constructor(public items: Coffee[] = []) { }

  addCoffee(coffee: Coffee) {
    this.items.push(coffee);
  }

  total(): number {
    return this.items.reduce((sum, coffee) => sum + coffee.cost(), 0);
  }
}