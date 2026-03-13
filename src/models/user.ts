import { Order } from "./order.js";
import { InsufficientFundsError } from "../errors/InsufficientFundsError.js";
import { Meal } from "./meals.js";

type Wallet = number | Record<string, number>;

export class User {
  public id: number;
  public name: string;
  public wallet: Wallet;
  public orders: Order[];

  constructor(id: number, name: string, wallet: number, orders: Order[]) {
    this.id = id;
    this.name = name;
    this.wallet = wallet;
    this.orders = orders;
  }

  getTotalWallet(): number {
    if (typeof this.wallet === "number") {
      return this.wallet;
    }
    let total = 0;
    for (const account of Object.values(this.wallet)) {
      total += this.wallet[account];
    }
    return total;
  }

  getTotalSpent():number{
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  orderMeal(meal: Meal) {
    const totalMoney = this.getTotalWallet();

    if (totalMoney < meal.price) {
      throw new InsufficientFundsError(totalMoney, meal.price);
    }

    if (typeof this.wallet === "number") {
        this.wallet -= meal.price;
    } else {
        let remainingPrice = meal.price;
        for(const account in this.wallet) {
            if (remainingPrice <= 0) break;

            const deduction = Math.min(this.wallet[account], remainingPrice);
            this.wallet[account] -= deduction;
            remainingPrice -= deduction;
    }
  }

    const newOrder: Order = {
        id: Date.now(),
        meals: [meal],
        total: meal.price
};
    this.orders.push(newOrder);
    return newOrder;
    }
}
