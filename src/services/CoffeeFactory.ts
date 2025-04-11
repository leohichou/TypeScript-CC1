import { Coffee, Espresso, Latte, Cappuccino } from "../models/Coffee.js";

// Define an Enum for Coffee Types
export enum CoffeeType {
  Espresso = "espresso",
  Latte = "latte",
  Cappuccino = "cappuccino"
}

export class CoffeeFactory {
  static createCoffee(type: CoffeeType): Coffee {
    switch (type) {
      case CoffeeType.Espresso:
        return new Espresso();
      case CoffeeType.Latte:
        return new Latte();
      case CoffeeType.Cappuccino:
        return new Cappuccino();
      default:
        throw new Error(`Invalid coffee type: ${type}`);
    }
  }
}
