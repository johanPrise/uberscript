import {Meal} from "../models/meals.js"

const API_URL = "https://keligmartin.github.io/api/meals.json";

export async function fetchMeals(): Promise<Meal[]> {
    try{
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as Meal[];
    } catch(error){
        console.error("Failed to fetch meals:", error);
        return [];
    }
}

