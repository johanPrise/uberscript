import { fetchMeals } from "./api/meals.api.js";
import { Meal } from "./models/meals.js";

const mealListElement = document.getElementById("mealList") as HTMLUListElement;



const displayMeals = (meals: Meal[]) => {
    if (!mealListElement){
        console.error("Élement 'mealList' introuvable dans le DOM.");
    }
    mealListElement.innerHTML = "";

    for(const meal of meals){
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
            <div>
                <strong>${meal.name}</strong> 
                <span class="badge bg-secondary ms-2">${meal.price}€</span>
                <br>
                <small class="text-muted">${meal.calories} kcal</small>
            </div>
            <button class="btn btn-primary btn-sm" data-id="${meal.id}">Commander</button>
        `;

        mealListElement.appendChild(li);

    }   
}

    const meals = await fetchMeals();
    displayMeals(meals);
