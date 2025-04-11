// This function opens an IndexedDB database, handles versioning, and executes a callback for upgrading.
export function openDB(
  name: string,
  version: number,
  upgradeCallback: (db: IDBDatabase) => void
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    // Handle the database upgrade process
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;
      try {
        upgradeCallback(db);  // Call the provided upgrade callback
      } catch (error) {
        reject(`Error during database upgrade: ${error}`);
      }
    };

    // Handle successful database opening
    request.onsuccess = () => resolve(request.result);

    // Handle error when opening the database
    request.onerror = (event: Event) => {
      const target = event.target as IDBRequest;
      reject(`Error opening the database: ${target.error?.message || 'Unknown error'}`);
    };
  });
}
// In a file like utils/db.ts or directly in your main.ts if you prefer

export function deleteDatabase(dbName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      console.log(`Database '${dbName}' deleted successfully.`);
      resolve();
    };

    request.onerror = (event) => {
      console.error(`Error deleting database '${dbName}':`, (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };

    request.onblocked = () => {
      console.warn(`Deletion of database '${dbName}' is blocked!`);
    };
  });
}
