import { Meal } from "./meals";

export type Order = {
    id: number;
    meals: Meal[];
    total:number;
}

export type OrderStorage = Omit<Order, "meals"> & {
    mealIds: number[];
}