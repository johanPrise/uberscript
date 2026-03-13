import { fetchMeals } from "./api/meals.api.js";
import { Meal } from "./models/meals.js";
import { User } from "./models/user.js";
import { InsufficientFundsError } from "./errors/InsufficientFundsError.js";
import { saveOrders, loadOrders } from "./services/storage.service.js";

let allMeals: Meal[] = [];
const user = new User(1, "Yorick", 150, []);

const userPanel = document.createElement("div");
userPanel.className = "mt-5";
userPanel.innerHTML = `
    <hr>
    <div class="card shadow">
        <div class="card-body">
            <h3 class="card-title">Espace de Bob</h3>
            <p class="mb-2">
                <span class="text-muted">Solde:</span> 
                <strong id="wallet-display" class="text-success fs-5">...</strong>
            </p>
            <h5 class="mt-4 mb-3">Ses commandes :</h5>
            <ul id="orderList" class="list-group"></ul>
        </div>
    </div>
`;
document.body.appendChild(userPanel);

const mealListElement = document.getElementById("mealList") as HTMLUListElement;
const walletDisplayElement = document.getElementById("wallet-display") as HTMLSpanElement;
const orderListElement = document.getElementById("orderList") as HTMLUListElement;

const displayMeals = (meals: Meal[]) => {
    if (!mealListElement) {
        console.error("Élément 'mealList' introuvable dans le DOM.");
        return;
    }
    mealListElement.innerHTML = "";

    for (const meal of meals) {
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
};

const displayWallet = () => {
    walletDisplayElement.textContent = user.getTotalWallet() + '€';
};

const displayOrders = () => {
    orderListElement.innerHTML = "";
    
    if (user.orders.length === 0) {
        orderListElement.innerHTML = '<li class="list-group-item text-muted">Aucune commande pour le moment</li>';
        return;
    }
    
    user.orders.forEach(order => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        const names = order.meals.map(m => m.name).join(", ");
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>Commande #${order.id}</strong><br>
                    <small class="text-muted">${names}</small>
                </div>
                <span class="badge bg-success">${order.total}€</span>
            </div>
        `;
        orderListElement.appendChild(li);
    });
};

mealListElement.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const mealIdStr = target.dataset.id;

    if (mealIdStr) {
        const mealId = Number.parseInt(mealIdStr, 10);
        const mealToOrder = allMeals.find(m => m.id === mealId);

        if (mealToOrder) {
            try {
                user.orderMeal(mealToOrder);
                saveOrders(user.orders);
                displayWallet();
                displayOrders();
            } catch (error) {
                if (error instanceof InsufficientFundsError) {
                    alert(`Oups ! ${error.message}`);
                } else {
                    console.error("Autre erreur", error);
                }
            }
        }
    }
});

const meals = await fetchMeals();
allMeals = meals;

user.orders = loadOrders(allMeals);
displayMeals(meals);
displayWallet();
displayOrders();
