export class OrderDAO {
    constructor() {
        this.dbName = "CoffeeShopDB";
        this.storeName = "orders";
    }
    // Initialize IndexedDB and create the object store if necessary
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }
    // Add a new order to the database
    async addOrder(order) {
        const db = await this.init();
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        store.add(order);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = (event) => {
                const error = event.target.error;
                console.error('Error adding order:', error); // Log error for debugging
                reject(error);
            };
        });
    }
    // Get all orders from the database
    async getAllOrders() {
        const db = await this.init();
        const tx = db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const orders = [];
        return new Promise((resolve, reject) => {
            const cursorRequest = store.openCursor();
            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    orders.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(orders); // Resolve when all orders have been fetched
                }
            };
            cursorRequest.onerror = (event) => {
                const error = event.target.error;
                console.error('Error fetching orders:', error); // Log error for debugging
                reject(error);
            };
        });
    }
    // Get a specific order by ID
    async getOrderById(id) {
        const db = await this.init();
        const tx = db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                const error = event.target.error;
                console.error(`Error fetching order with ID ${id}:`, error); // Log error for debugging
                reject(error);
            };
        });
    }
    // Update an existing order in the database
    async updateOrder(order) {
        const db = await this.init();
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        store.put(order); // Uses the keyPath `id` to identify the order to update
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = (event) => {
                const error = event.target.error;
                console.error('Error updating order:', error); // Log error for debugging
                reject(error);
            };
        });
    }
    // Delete an order from the database
    async deleteOrder(id) {
        const db = await this.init();
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        store.delete(id);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = (event) => {
                const error = event.target.error;
                console.error(`Error deleting order with ID ${id}:`, error); // Log error for debugging
                reject(error);
            };
        });
    }
}
