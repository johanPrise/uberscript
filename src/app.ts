import { fetchMeals } from "./api/meals.api.js";
import { Meal } from "./models/meals.js";
import { User } from "./models/user.js";
import { InsufficientFundsError } from "./errors/InsufficientFundsError.js";
import { saveOrders, loadOrders } from "./services/storage.service.js";

let allMeals: Meal[] = [];
const user = new User(1, "Yorick", 150, []);

const filterPanel = document.createElement("div");
filterPanel.className = "input-group mb-4 mt-4";
filterPanel.innerHTML = `
    <span class="input-group-text">Prix Max:</span>
    <input type="number" id="maxPriceInput" class="form-control" placeholder="15">
    <button class="btn btn-outline-secondary" id="filterBtn" type="button">Filtrer</button>
    <button class="btn btn-outline-warning" id="resetFilterBtn" type="button">Reset</button>
`;
document.body.insertBefore(filterPanel, document.body.firstChild);

const maxPriceInput = document.getElementById("maxPriceInput") as HTMLInputElement;
const filterBtn = document.getElementById("filterBtn") as HTMLButtonElement;
const resetFilterBtn = document.getElementById("resetFilterBtn") as HTMLButtonElement;

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

userPanel.innerHTML = `
<hr>
    <h3>Espace de Bob</h3>
    <p>Solde restant: <strong id="wallet-display">...</strong></p>
    <p>Total dépensé chez nous: <strong class="text-danger" id="total-spent-display">...</strong></p>
    <h4>Ses commandes :</h4>
    <ul id="orderList"></ul>
`
document.body.appendChild(userPanel);

const mealListElement = document.getElementById("mealList") as HTMLUListElement;
const walletDisplayElement = document.getElementById("wallet-display") as HTMLSpanElement;
const orderListElement = document.getElementById("orderList") as HTMLUListElement;
const totalSpentDisplayElement = document.getElementById("total-spent-display") as HTMLSpanElement;

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
    totalSpentDisplayElement.textContent = user.getTotalSpent() + '€';

};

const displayOrders = () => {
    orderListElement.innerHTML = "";
    
    if (user.orders.length === 0) {
        orderListElement.innerHTML = '<li class="list-group-item text-muted">Aucune commande pour le moment</li>';
        return;
    }
    
    user.orders.forEach(order => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center mb-1";
        const names = order.meals.map(m => m.name).join(", ");
        
        li.innerHTML = `
            <span>Commande #${order.id} : ${names} - Payé : <strong>${order.total}€</strong></span>
            <button class="btn btn-outline-danger btn-sm" data-order-id="${order.id}">Annuler</button>
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

orderListElement.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const orderIdStr = target.dataset.orderId;
    
    if (orderIdStr) {
        const orderId = Number.parseInt(orderIdStr, 10);
        user.removeOrder(orderId);
        saveOrders(user.orders);
        displayWallet();
        displayOrders();
    }
});

filterBtn.addEventListener("click", () => {
    const maxPrice = Number.parseFloat(maxPriceInput.value);
    
    if (Number.isNaN(maxPrice)) return;

    const filteredMeals = allMeals.filter(meal => meal.price <= maxPrice);
    displayMeals(filteredMeals);
});

resetFilterBtn.addEventListener("click", () => {
    maxPriceInput.value = "";
    displayMeals(allMeals);
});

const meals = await fetchMeals();
allMeals = meals;

user.orders = loadOrders(allMeals);
displayMeals(meals);
displayWallet();
displayOrders();
