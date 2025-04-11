import { CoffeeFactory } from "./CoffeeFactory.js";
import { Milk, Sugar, WhippedCream } from "../models/Customization.js";
// Define an Enum for Customization Types
export var CustomizationType;
(function (CustomizationType) {
    CustomizationType["Milk"] = "milk";
    CustomizationType["Sugar"] = "sugar";
    CustomizationType["WhippedCream"] = "whippedcream";
})(CustomizationType || (CustomizationType = {}));
export class Manager {
    constructor() {
        this.orders = [];
    }
    // Refactor createOrder to accept CoffeeType and CustomizationType enums
    createOrder(type, customizations) {
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
    listOrders() {
        return this.orders.map(c => `${c.description} - $${c.cost().toFixed(2)}`);
    }
}
console.log('Manager class is loaded');
