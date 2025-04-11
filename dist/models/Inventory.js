export class InventoryManager {
    // Private constructor to enforce singleton pattern
    constructor() {
        this.ingredients = new Map();
    }
    // Returns the singleton instance of InventoryManager
    static getInstance() {
        if (!InventoryManager.instance) {
            InventoryManager.instance = new InventoryManager();
        }
        return InventoryManager.instance;
    }
    /**
     * Adds ingredients to the inventory.
     * If the ingredient already exists, it increases the quantity.
     * @param name The name of the ingredient
     * @param qty The quantity of the ingredient to add
     */
    addIngredient(name, qty) {
        this.ingredients.set(name, (this.ingredients.get(name) || 0) + qty);
    }
    /**
     * Uses an ingredient from the inventory.
     * If the ingredient has enough quantity, it decreases the quantity.
     * @param name The name of the ingredient
     * @param qty The quantity of the ingredient to use
     * @returns True if the ingredient is used successfully, false if not enough is available
     */
    useIngredient(name, qty) {
        const available = this.ingredients.get(name) || 0;
        if (available >= qty) {
            this.ingredients.set(name, available - qty);
            return true;
        }
        return false;
    }
    /**
     * Gets the current inventory.
     * @returns A Map with ingredient names as keys and quantities as values
     */
    getInventory() {
        return this.ingredients;
    }
}
