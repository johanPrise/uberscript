// src/app.ts
import { fetchMeals } from "./api/meals.api.js";

async function testerAPI() {
    console.log("Appel de l'API en cours...");
    const repas = await fetchMeals();
    console.log("Résultat reçu de l'API :", repas);
}

testerAPI();