export abstract class Coffee {
      id?: number;
    abstract get description(): string;

  abstract cost(): number;
}

export class Espresso extends Coffee {
     get description() {
    return "Espresso";
  }
  cost() { return 2.0; }
}

export class Latte extends Coffee {
  get description() {
    return "Latte";
  }
  cost() {
    return 3.5;
  }
}


export class Cappuccino extends Coffee {
      get description() {
    return "Cappuccino";
  } 
  cost() { return 4.0; }
}