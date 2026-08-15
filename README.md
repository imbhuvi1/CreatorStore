# CreatorStore

A backend API for a small e-commerce / creator-store platform, built with Spring Boot. It manages products and orders, handles stock deduction on purchase, and calculates order totals server-side.

## Tech Stack

- **Java 21**
- **Spring Boot** (Web, Data JPA)
- **PostgreSQL** — primary database
- **Lombok** — boilerplate reduction (getters/setters/builders)
- **Jakarta Bean Validation** — request validation
- **dotenv-java** — loads environment variables from a local `.env` file

## Features

- **Product management** — create, update, list, fetch by ID, and delete products, with stock quantity and price tracking.
- **Order placement** — place an order with one or more line items; the service:
  - Validates that each product exists and has sufficient stock.
  - Calculates line-item and total prices from current product prices.
  - Decrements product stock atomically within the transaction.
  - Persists the order together with its order items.
- **Validation** — request DTOs enforce required fields, valid email format, and minimum quantities using Jakarta Validation annotations.

## Project Structure

```
com.bhuvnesh.creatorstore
├── controllers      # REST endpoints (OrderController, ProductController)
├── dto              # Request/response payloads (OrderRequest, OrderItemRequest)
├── entities         # JPA entities (Order, OrderItem, Product)
├── repositories     # Spring Data JPA repositories
└── services         # Business logic (OrderService, ProductService)
```

## API Endpoints

### Products — `/api/products`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | Create a new product |
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get a product by ID |
| PUT | `/api/products/{id}` | Update an existing product |
| DELETE | `/api/products/{id}` | Delete a product |

### Orders — `/api/orders`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders` | List all orders *(planned)* |
| GET | `/api/orders/{id}` | Get an order by ID *(planned)* |

### Prerequisites

- Java 21+
- Maven
- A running PostgreSQL instance

The app will start on `http://localhost:8080` by default. Hibernate is configured with `ddl-auto: update`, so tables are created/updated automatically based on the entities.

## Roadmap

- [ ] Implement `GET /api/orders` and `GET /api/orders/{id}`
- [ ] Replace raw entity responses with dedicated response DTOs
- [ ] Add global exception handling (e.g. `@ControllerAdvice`) for cleaner error responses
- [ ] Add pagination to product/order listing endpoints
- [ ] Add automated tests (unit + integration)
