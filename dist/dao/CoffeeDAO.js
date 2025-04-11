import { Espresso, Latte, Cappuccino } from "../models/Coffee.js"; // Adjust this import based on your project structure
export class CoffeeDAO {
    constructor() {
        this.dbName = "CoffeeDB";
    }
    // Initializes the IndexedDB database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("coffees")) {
                    db.createObjectStore("coffees", { keyPath: "id", autoIncrement: true });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }
    // Adds a coffee item to the IndexedDB database
    async addCoffee(coffee) {
        const db = await this.init(); // Initialize database connection
        const tx = db.transaction("coffees", "readwrite"); // Start a transaction
        const store = tx.objectStore("coffees");
        // Add the coffee item to the object store
        store.add({
            description: coffee.description, // Get the description from the Coffee subclass
            cost: coffee.cost(), // Get the cost from the Coffee subclass
        });
        // Return a promise that resolves when the transaction completes
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(); // Resolves when transaction is successful
            tx.onerror = (event) => {
                const target = event.target; // Type-casting to IDBTransaction
                reject(target.error); // Rejects the promise if there's an error in the transaction
            };
            tx.onabort = () => reject("Transaction aborted"); // Rejects the promise if the transaction is aborted
        });
    }
    // Fetches all coffees from the database
    async getAllCoffees() {
        const db = await this.init();
        const tx = db.transaction("coffees", "readonly");
        const store = tx.objectStore("coffees");
        return new Promise((resolve, reject) => {
            const coffees = [];
            const cursorRequest = store.openCursor();
            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    // Since we can't store an instance of an abstract class in IndexedDB directly,
                    // we need to recreate the proper class based on the description.
                    let coffeeInstance;
                    switch (cursor.value.description) {
                        case "Espresso":
                            coffeeInstance = new Espresso();
                            break;
                        case "Latte":
                            coffeeInstance = new Latte();
                            break;
                        case "Cappuccino":
                            coffeeInstance = new Cappuccino();
                            break;
                        default:
                            coffeeInstance = new Espresso(); // Default case
                    }
                    coffees.push(coffeeInstance);
                    cursor.continue();
                }
                else {
                    resolve(coffees); // Resolves with all the fetched coffees
                }
            };
            cursorRequest.onerror = (event) => {
                const target = event.target;
                reject(target.error); // Rejects the promise if an error occurs
            };
        });
    }
}
