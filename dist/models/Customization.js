import { Coffee } from "./Coffee.js";
export class Customization extends Coffee {
    constructor(coffee) {
        super();
        this.coffee = coffee;
    }
    get description() {
        return this.coffee.description;
    }
}
export class Milk extends Customization {
    cost() { return this.coffee.cost() + 0.5; }
    get description() { return this.coffee.description + ", Milk"; }
}
export class Sugar extends Customization {
    cost() { return this.coffee.cost() + 0.2; }
    get description() { return this.coffee.description + ", Sugar"; }
}
export class WhippedCream extends Customization {
    cost() { return this.coffee.cost() + 0.7; }
    get description() { return this.coffee.description + ", Whipped Cream"; }
}
