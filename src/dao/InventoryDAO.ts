import { InventoryManager } from "../models/Inventory.js";  // Assuming the model is in ../models/Inventory

export class InventoryDAO {
  private dbName = "InventoryDB";  // Name of the IndexedDB database for inventory

  // Initializes the IndexedDB database
  async init(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("inventory")) {
          db.createObjectStore("inventory", { keyPath: "name" });  // Using 'name' as the key path for ingredients
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  /**
   * Adds or updates an ingredient in the inventory.
   * @param name The name of the ingredient
   * @param qty The quantity of the ingredient
   */
  async addIngredient(name: string, qty: number): Promise<void> {
    const db = await this.init();
    const tx = db.transaction("inventory", "readwrite");
    const store = tx.objectStore("inventory");

    const existing = await this.getIngredient(name);  // Check if ingredient exists already

    // If ingredient exists, update quantity, otherwise add it
    if (existing) {
      existing.quantity += qty;
      store.put(existing);  // Update the existing ingredient
    } else {
      store.add({ name, quantity: qty });  // Add new ingredient
    }

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();  // Resolve if the transaction is successful
      tx.onerror = (event) => {
        const target = event.target as IDBTransaction;
        reject(target.error);  // Reject if there was an error in the transaction
      };
    });
  }

  /**
   * Retrieves an ingredient by name from the inventory.
   * @param name The name of the ingredient to retrieve
   * @returns The ingredient object, or null if not found
   */
  async getIngredient(name: string): Promise<{ name: string; quantity: number } | null> {
    const db = await this.init();
    const tx = db.transaction("inventory", "readonly");
    const store = tx.objectStore("inventory");

    return new Promise<{ name: string; quantity: number } | null>((resolve, reject) => {
      const request = store.get(name);

      request.onsuccess = (event) => {
        const result = request.result;
        resolve(result || null);  // Resolve with ingredient if found, or null if not found
      };

      request.onerror = (event) => {
        const target = event.target as IDBRequest;
        reject(target.error);  // Reject if there was an error retrieving the ingredient
      };
    });
  }

  /**
   * Fetches all ingredients from the inventory.
   * @returns A list of all ingredients in the inventory
   */
  async getAllIngredients(): Promise<{ name: string; quantity: number }[]> {
    const db = await this.init();
    const tx = db.transaction("inventory", "readonly");
    const store = tx.objectStore("inventory");

    return new Promise<{ name: string; quantity: number }[]>((resolve, reject) => {
      const ingredients: { name: string; quantity: number }[] = [];
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          ingredients.push(cursor.value);  // Add ingredient to array
          cursor.continue();  // Continue to the next ingredient
        } else {
          resolve(ingredients);  // Resolve with the array of all ingredients
        }
      };

      cursorRequest.onerror = (event) => {
        const target = event.target as IDBRequest;
        reject(target.error);  // Reject if there was an error fetching the ingredients
      };
    });
  }
}
