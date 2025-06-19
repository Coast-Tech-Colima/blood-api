# Express API Documentation

## Overview
This project is an Express API that provides endpoints for managing users, requests, and donations. It utilizes TypeScript for type safety and Zod for data validation.

## Project Structure
```
express-api
├── src
│   ├── app.ts                  # Entry point of the application
│   ├── controllers             # Contains controller files for handling requests
│   │   ├── userController.ts    # User-related operations
│   │   ├── requestController.ts  # Request-related operations
│   │   └── donationController.ts # Donation-related operations
│   ├── routes                  # Contains route definitions
│   │   ├── userRoutes.ts        # Routes for user operations
│   │   ├── requestRoutes.ts     # Routes for request operations
│   │   └── donationRoutes.ts    # Routes for donation operations
│   ├── schemas                 # Contains schema definitions for validation
│   │   ├── user.schema.ts       # User schema for validation
│   │   ├── request.schema.ts    # Request schema for validation
│   │   └── donationRequest.schema.ts # Donation request schema for validation
│   └── utils                   # Utility functions
│       └── distance.ts          # Haversine distance calculation
├── package.json                # NPM configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd express-api
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the server, run:
```
npm start
```
The server will be running on `http://localhost:3000`.

## API Endpoints
- **User Endpoints**
  - `POST /users` - Create a new user
  - `GET /users` - Fetch all users
  - `GET /users/:id` - Fetch user by ID

- **Request Endpoints**
  - `POST /requests` - Create a new request
  - `GET /requests` - Fetch all requests
  - `GET /requests/:id` - Fetch request by ID

- **Donation Endpoints**
  - `POST /donations` - Create a new donation request
  - `GET /donations` - Fetch all donation requests
  - `GET /donations/:id` - Fetch donation request by ID

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.