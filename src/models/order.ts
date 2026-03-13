import { Meal } from "./meals";

export type Order = {
    id: number;
    meals: Meal[];
    total:number;
}