import { Espresso, Latte, Cappuccino } from "../models/Coffee.js";
// Define an Enum for Coffee Types
export var CoffeeType;
(function (CoffeeType) {
    CoffeeType["Espresso"] = "espresso";
    CoffeeType["Latte"] = "latte";
    CoffeeType["Cappuccino"] = "cappuccino";
})(CoffeeType || (CoffeeType = {}));
export class CoffeeFactory {
    static createCoffee(type) {
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
