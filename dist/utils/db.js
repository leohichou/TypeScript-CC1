// This function opens an IndexedDB database, handles versioning, and executes a callback for upgrading.
export function openDB(name, version, upgradeCallback) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);
        // Handle the database upgrade process
        request.onupgradeneeded = (event) => {
            const db = request.result;
            try {
                upgradeCallback(db); // Call the provided upgrade callback
            }
            catch (error) {
                reject(`Error during database upgrade: ${error}`);
            }
        };
        // Handle successful database opening
        request.onsuccess = () => resolve(request.result);
        // Handle error when opening the database
        request.onerror = (event) => {
            var _a;
            const target = event.target;
            reject(`Error opening the database: ${((_a = target.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'}`);
        };
    });
}
// In a file like utils/db.ts or directly in your main.ts if you prefer
export function deleteDatabase(dbName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(dbName);
        request.onsuccess = () => {
            console.log(`Database '${dbName}' deleted successfully.`);
            resolve();
        };
        request.onerror = (event) => {
            console.error(`Error deleting database '${dbName}':`, event.target.error);
            reject(event.target.error);
        };
        request.onblocked = () => {
            console.warn(`Deletion of database '${dbName}' is blocked!`);
        };
    });
}
