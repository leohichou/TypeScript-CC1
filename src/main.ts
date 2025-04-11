// Import necessary modules and classes
import { CoffeeFactory, CoffeeType } from "./services/CoffeeFactory.js";
import { Coffee } from "../src/models/Coffee.js";
import { Milk, Sugar, WhippedCream } from "./models/Customization.js";
import { Manager } from "./services/Manager.js";
import { openDB } from "./utils/db.js";

// Global DB name and version (should match what is used in openDB)
const DB_NAME = "CoffeeShopDBB";
const DB_VERSION = 1;

// Function to create a custom coffee order using Manager
async function createCustomOrder(coffeeType: CoffeeType, milk: boolean, sugar: boolean, whippedCream: boolean): Promise<Coffee> {
  const manager = new Manager();
  let customCoffee = manager.createOrder(coffeeType, []);

  if (milk) customCoffee = new Milk(customCoffee);
  if (sugar) customCoffee = new Sugar(customCoffee);
  if (whippedCream) customCoffee = new WhippedCream(customCoffee);

  return customCoffee;
}

// Function to place the order into IndexedDB
async function placeOrder(customCoffee: Coffee): Promise<void> {
  // Open the DB using your utility function
  const db = await openDB(DB_NAME, DB_VERSION, (db: IDBDatabase) => {
    if (!db.objectStoreNames.contains('orders')) {
      db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
    }
  });

  // Create the order object
  const order = {
    // customCoffee.id might be undefined if not set; you might want to store the coffee description instead
    coffeeId: customCoffee.id ?? customCoffee.description,
    description: customCoffee.description,
    quantity: 1,
    totalPrice: customCoffee.cost(),
    date: new Date().toISOString(),
  };

  // Start a new transaction to write the order
  const tx = db.transaction("orders", "readwrite");
  const store = tx.objectStore("orders");
  const request = store.add(order);

  // Return a promise that resolves when the transaction completes
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}

// Function to fetch all orders from IndexedDB (actual data)
async function getAllOrdersFromDB(): Promise<any[]> {
  const db = await openDB(DB_NAME, DB_VERSION, (db: IDBDatabase) => {
    if (!db.objectStoreNames.contains('orders')) {
      db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
    }
  });

  // Start a read-only transaction for orders
  const tx = db.transaction("orders", "readonly");
  const store = tx.objectStore("orders");
  const request = store.getAll();

  return new Promise<any[]>((resolve, reject) => {
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}

// Function to load and display order history in the UI
async function loadOrderHistory(): Promise<void> {
  try {
    const orders = await getAllOrdersFromDB();
    const orderHistoryList = document.getElementById('orderHistoryList') as HTMLUListElement;
    orderHistoryList.innerHTML = ''; // Clear previous orders

    orders.forEach(order => {
      const listItem = document.createElement('li');
      listItem.textContent = `Order for ${order.description} - Quantity: ${order.quantity} - Total: $${order.totalPrice}`;
      orderHistoryList.appendChild(listItem);
    });
  } catch (error) {
    log('Error loading orders from IndexedDB: ' + error);
  }
}

// Simple log function to display messages in the logs area
function log(message: string): void {
  const logsDiv = document.getElementById('logs') as HTMLDivElement;
  const logMessage = document.createElement('p');
  logMessage.textContent = message;
  logsDiv.appendChild(logMessage);
}

// --- Event Listener for the Place Order Button ---
document.getElementById('placeOrderBtn')?.addEventListener('click', async () => {
  try {
    const coffeeSelect = (document.getElementById('coffeeSelect') as HTMLSelectElement).value;
    const milk = (document.getElementById('milk') as HTMLInputElement).checked;
    const sugar = (document.getElementById('sugar') as HTMLInputElement).checked;
    const whippedCream = (document.getElementById('whippedCream') as HTMLInputElement).checked;

    // Create the custom coffee order
    const customCoffee = await createCustomOrder(coffeeSelect as CoffeeType, milk, sugar, whippedCream);

    // Update the order summary in the UI
    (document.getElementById('orderDetails') as HTMLParagraphElement).textContent =
      `Custom Order: ${customCoffee.description} - $${customCoffee.cost().toFixed(2)}`;

    // Log the order creation
    log(`Custom Coffee Order Created: ${customCoffee.description} - $${customCoffee.cost().toFixed(2)}`);

    // Place the order in IndexedDB
    await placeOrder(customCoffee);

    // Update order history
    loadOrderHistory();
  } catch (error) {
    log('Error placing order: ' + error);
  }
});

// On page load, load existing order history
window.onload = loadOrderHistory;

// (Optional) You can also initialize the database here if needed.
