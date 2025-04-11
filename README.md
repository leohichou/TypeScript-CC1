# Coffee Shop Management

This project is a web-based Coffee Shop Management application that allows users to select a coffee, customize it by adding ingredients (such as Milk, Sugar, or Whipped Cream), place orders, and view an order history. The application is built with TypeScript, uses the Decorator Pattern for coffee customizations, and employs IndexedDB for local data persistence.

## Features

- **Coffee Selection:**  
  Users can choose from several types of coffee (Espresso, Latte, Cappuccino).

- **Coffee Customization:**  
  Users can customize their coffee by adding one or more options:
  - Milk
  - Sugar
  - Whipped Cream

- **Order Placement:**  
  Orders are created based on the selected coffee and customizations. These orders are stored in an IndexedDB database.

- **Order History:**  
  The app dynamically loads and displays a history of all orders placed, directly fetched from IndexedDB.

- **Reset Database (Optional):**  
  A "Reset Database" feature can be implemented to clear all stored data and start fresh.

## Technologies Used

- **TypeScript:**  
  Provides a strongly typed codebase to catch errors early during development.

- **IndexedDB:**  
  Used for storing persistent data on the client side, such as coffee details, orders, and inventory information.

- **Decorator Pattern:**  
  Applied to allow dynamic customization of coffee objects by wrapping a base coffee with additional features.

- **HTML & CSS:**  
  Used to build a responsive and modern user interface.

- **ES Modules:**  
  The project is built using ES Modules, ensuring a modern module system for browser-based applications.

## Project Structure
![Uploading Screenshot 2025-04-11 at 20.36.20.png…]()


## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/coffee-shop-management.git
   cd coffee-shop-management

2. **Install dependencies:**
If you're using a package manager (e.g., npm) and bundler (like Webpack or Vite), install the dependencies:
    ```bash
    npm install

3. **Compile the TypeScript Code:**
Ensure you have a valid `tsconfig.json` For example:
    ```json
    {
    "compilerOptions": {
     "target": "es2017", // ✅ Allow async/await
     "module": "esnext", // ✅ Allow top-level await
     "moduleResolution": "node",
     "outDir": "./dist",
     "rootDir": "./src",
     "strict": true,
     "esModuleInterop": true,
     "allowSyntheticDefaultImports": true,
     "forceConsistentCasingInFileNames": true
      }
      }

Then compile with:

bastsc
s
