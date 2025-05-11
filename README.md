# GameGearEcommerce

A full-stack e-commerce platform for buying and selling gaming gear, built with Angular 17 (frontend) and Node.js/Express/MongoDB (backend). Features a modern UI with PrimeNG, user authentication, item listing, cart, and order management.

---

## Features

### Frontend (Angular 17 + PrimeNG)
- **User Authentication**: Register, login, and session management.
- **Item Listing**: Browse, search, and filter gaming items.
- **My Items**: View and manage items you have listed for sale.
- **Cart**: Add, update, and remove items; checkout with order summary.
- **Order History**: View past orders with relative time and details.
- **Responsive Design**: Clean, modern UI with PrimeNG and PrimeFlex.
- **Skeleton Loaders**: Shimmer skeletons for all loading states.
- **Toast Notifications**: Popup feedback for cart actions, errors, and more.

### Backend (Node.js + Express + MongoDB)
- **REST API**: For users, items, and orders.
- **Session-based Auth**: Secure login/logout with express-session and MongoDB store.
- **Order Processing**: Handles item quantity, status, and order creation.
- **Validation & Error Handling**: Robust input checks and error responses.

---

## Project Structure

```
/src
  /app
    /core         # Core services (API, Auth, Cart, etc.)
    /pages        # Main user-facing pages (listing, cart, orders, etc.)
    /shared       # Reusable components (header, item card, skeletons, etc.)
  /environments   # Angular environment configs
/server
  /controllers    # Express route handlers
  /routes         # API route definitions
  /middlewares    # Auth and other middleware
  /models         # Mongoose models
/interfaces       # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or remote)

### Install dependencies

```sh
yarn install
```

### Development

- **Start frontend (Angular):**
  ```sh
  yarn dev-client
  ```
  Runs at [http://localhost:4200](http://localhost:4200)

- **Start backend (Express/Node):**
  ```sh
  yarn dev-server
  ```
  Runs at [http://localhost:3009](http://localhost:3009) by default

- **Start both (concurrently):**
  ```sh
  yarn dev
  ```

### Build for Production

```sh
yarn build
```
- Frontend build output: `dist/`
- Backend build output: `dist/server/`

### Run Production Server

```sh
yarn prod
```
- By default, runs backend at `PORT=3009`. Adjust `environment.prod.ts` for your API URL as needed.

---

## Scripts

- `yarn dev` - Run both frontend and backend in development mode
- `yarn build` - Build both frontend and backend
- `yarn prod` - Run the production server
- `yarn test` - Run frontend unit tests

---

## Technologies

- **Frontend:** Angular 17, PrimeNG, PrimeFlex, RxJS
- **Backend:** Node.js, Express, MongoDB, Mongoose, express-session
- **Other:** TypeScript, Moment.js, dotenv, bcrypt
