import { CoffeeFactory, CoffeeType } from "./CoffeeFactory.js";
import { Coffee } from "../models/Coffee.js";
import { Milk, Sugar, WhippedCream } from "../models/Customization.js";

// Define an Enum for Customization Types
export enum CustomizationType {
  Milk = "milk",
  Sugar = "sugar",
  WhippedCream = "whippedcream"
}

export class Manager {
  orders: Coffee[] = [];

  // Refactor createOrder to accept CoffeeType and CustomizationType enums
  createOrder(type: CoffeeType, customizations: CustomizationType[]): Coffee {
    let coffee = CoffeeFactory.createCoffee(type);

    // Apply customizations based on the provided customization type
    customizations.forEach(customization => {
      switch (customization) {
        case CustomizationType.Milk:
          coffee = new Milk(coffee);
          break;
        case CustomizationType.Sugar:
          coffee = new Sugar(coffee);
          break;
        case CustomizationType.WhippedCream:
          coffee = new WhippedCream(coffee);
          break;
        default:
          console.warn(`Unknown customization: ${customization}`);
      }
    });

    // Add the coffee to the orders list
    this.orders.push(coffee);
    return coffee;
  }

  // List all orders in a human-readable format
  listOrders(): string[] {
    return this.orders.map(c => `${c.description} - $${c.cost().toFixed(2)}`);
  }
}
console.log('Manager class is loaded');
