export class InventoryDAO {
    constructor() {
        this.dbName = "InventoryDB"; // Name of the IndexedDB database for inventory
    }
    // Initializes the IndexedDB database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("inventory")) {
                    db.createObjectStore("inventory", { keyPath: "name" }); // Using 'name' as the key path for ingredients
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }
    /**
     * Adds or updates an ingredient in the inventory.
     * @param name The name of the ingredient
     * @param qty The quantity of the ingredient
     */
    async addIngredient(name, qty) {
        const db = await this.init();
        const tx = db.transaction("inventory", "readwrite");
        const store = tx.objectStore("inventory");
        const existing = await this.getIngredient(name); // Check if ingredient exists already
        // If ingredient exists, update quantity, otherwise add it
        if (existing) {
            existing.quantity += qty;
            store.put(existing); // Update the existing ingredient
        }
        else {
            store.add({ name, quantity: qty }); // Add new ingredient
        }
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(); // Resolve if the transaction is successful
            tx.onerror = (event) => {
                const target = event.target;
                reject(target.error); // Reject if there was an error in the transaction
            };
        });
    }
    /**
     * Retrieves an ingredient by name from the inventory.
     * @param name The name of the ingredient to retrieve
     * @returns The ingredient object, or null if not found
     */
    async getIngredient(name) {
        const db = await this.init();
        const tx = db.transaction("inventory", "readonly");
        const store = tx.objectStore("inventory");
        return new Promise((resolve, reject) => {
            const request = store.get(name);
            request.onsuccess = (event) => {
                const result = request.result;
                resolve(result || null); // Resolve with ingredient if found, or null if not found
            };
            request.onerror = (event) => {
                const target = event.target;
                reject(target.error); // Reject if there was an error retrieving the ingredient
            };
        });
    }
    /**
     * Fetches all ingredients from the inventory.
     * @returns A list of all ingredients in the inventory
     */
    async getAllIngredients() {
        const db = await this.init();
        const tx = db.transaction("inventory", "readonly");
        const store = tx.objectStore("inventory");
        return new Promise((resolve, reject) => {
            const ingredients = [];
            const cursorRequest = store.openCursor();
            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    ingredients.push(cursor.value); // Add ingredient to array
                    cursor.continue(); // Continue to the next ingredient
                }
                else {
                    resolve(ingredients); // Resolve with the array of all ingredients
                }
            };
            cursorRequest.onerror = (event) => {
                const target = event.target;
                reject(target.error); // Reject if there was an error fetching the ingredients
            };
        });
    }
}
