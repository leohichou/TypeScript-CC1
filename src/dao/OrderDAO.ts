export interface Order {
  id?: number;            // Optional because it will be auto-incremented
  coffeeId: number;       // The ID of the coffee ordered
  quantity: number;       // Number of coffees ordered
  totalPrice: number;     // Total price for the order
  date: string;           // Date and time of the order
}

export class OrderDAO {
  private dbName = "CoffeeShopDB";
  private storeName = "orders";

  // Initialize IndexedDB and create the object store if necessary
  async init(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  // Add a new order to the database
  async addOrder(order: Order): Promise<void> {
    const db = await this.init();
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);

    store.add(order);

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = (event) => {
        const error = (event.target as IDBTransaction).error;
        console.error('Error adding order:', error); // Log error for debugging
        reject(error);
      };
    });
  }

  // Get all orders from the database
  async getAllOrders(): Promise<Order[]> {
    const db = await this.init();
    const tx = db.transaction(this.storeName, "readonly");
    const store = tx.objectStore(this.storeName);
    const orders: Order[] = [];

    return new Promise<Order[]>((resolve, reject) => {
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          orders.push(cursor.value);
          cursor.continue();
        } else {
          resolve(orders); // Resolve when all orders have been fetched
        }
      };

      cursorRequest.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        console.error('Error fetching orders:', error); // Log error for debugging
        reject(error);
      };
    });
  }

  // Get a specific order by ID
  async getOrderById(id: number): Promise<Order | undefined> {
    const db = await this.init();
    const tx = db.transaction(this.storeName, "readonly");
    const store = tx.objectStore(this.storeName);

    return new Promise<Order | undefined>((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        console.error(`Error fetching order with ID ${id}:`, error); // Log error for debugging
        reject(error);
      };
    });
  }

  // Update an existing order in the database
  async updateOrder(order: Order): Promise<void> {
    const db = await this.init();
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);

    store.put(order); // Uses the keyPath `id` to identify the order to update

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = (event) => {
        const error = (event.target as IDBTransaction).error;
        console.error('Error updating order:', error); // Log error for debugging
        reject(error);
      };
    });
  }

  // Delete an order from the database
  async deleteOrder(id: number): Promise<void> {
    const db = await this.init();
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);

    store.delete(id);

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = (event) => {
        const error = (event.target as IDBTransaction).error;
        console.error(`Error deleting order with ID ${id}:`, error); // Log error for debugging
        reject(error);
      };
    });
  }
}
