# Loan Server

This project is a backend server for managing loan applications. It is built using Node.js, Express, and MongoDB.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/ahmadmarhaba/loan-server.git
   cd loan-server
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Build the project:
   ```sh
   npm run build
   ```

## Usage

1. Start the server:

   ```sh
   npm start
   ```

2. For development, use:
   ```sh
   npm run dev
   ```

The server will be running at `http://localhost:<PORT>`.

## API Endpoints

### POST /v1/loan

Create a new loan application.

- **Request Body:**

  ```json
  {
    "name": "John Doe",
    "amount_gbp": 1000,
    "amount_original": 1200,
    "term": 12,
    "rate_used": 1.2,
    "currency": "USD"
  }
  ```

- **Response:**
  ```json
  {
    "_id": "60d5f9b8f8d2c8b0b8f8d2c8",
    "name": "John Doe",
    "amount_gbp": 1000,
    "amount_original": 1200,
    "term": 12,
    "rate_used": 1.2,
    "currency": "USD",
    "createdAt": "2023-10-01T00:00:00.000Z",
    "updatedAt": "2023-10-01T00:00:00.000Z"
  }
  ```

### GET /v1/loans

Fetch all loan applications.

- **Response:**
  ```json
  [
    {
      "_id": "60d5f9b8f8d2c8b0b8f8d2c8",
      "name": "John Doe",
      "amount_gbp": 1000,
      "amount_original": 1200,
      "term": 12,
      "rate_used": 1.2,
      "currency": "USD",
      "createdAt": "2023-10-01T00:00:00.000Z",
      "updatedAt": "2023-10-01T00:00:00.000Z"
    }
  ]
  ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/loan
```

## License

This project is licensed under the ISC License.
