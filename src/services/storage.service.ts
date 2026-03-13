import {Order, OrderStorage } from "../models/order.js"
import { Meal } from "../models/meals.js";

const STORAGE_KEY = "UBERSCRIPT_ORDERS";

export function saveOrders(orders: Order[]) {
    const serializedOrders: OrderStorage[] = orders.map(order => {
        return {
            id: order.id,
            total: order.total,
            mealIds: order.meals.map(meal => meal.id)
};
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedOrders));
}

export function loadOrders(meals: Meal[]): Order[] {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    
    try {
        const storedOrders: OrderStorage[] = JSON.parse(rawData) as OrderStorage[];
        let validOrders: Order[] = [];

        for (const stored of storedOrders) {
            const matchingMeals = stored.mealIds.map(id => meals.find(meal => meal.id === id)).filter((meal): meal is Meal => meal !== undefined);

            validOrders.push({
                id: stored.id,
                total: stored.total,
                meals: matchingMeals
            });
        }
        return validOrders;
    }catch (error) {
        console.error("Failed to load orders from storage:", error);
        return [];
    }
    }
