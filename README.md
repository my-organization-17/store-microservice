# Store Microservice

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![gRPC](https://img.shields.io/badge/gRPC-244C5A?style=flat&logo=google&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat&logo=drizzle&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black)

A gRPC-based microservice for managing store categories, items, attributes, prices, and images in the CoffeeDoor microservices ecosystem. Supports multi-language translations (EN, UK, RU, DE, ES, FR).

## Features

- **Category Management** - Create, update, delete, and reorder store categories
- **Multi-Language Support** - Translations for 6 languages (English, Ukrainian, Russian, German, Spanish, French)
- **Smart Positioning** - Automatic sort order adjustment when reordering categories
- **Translation CRUD** - Upsert and delete translations for categories independently
- **Health Checks** - Liveness and readiness endpoints with dependency status

## Technology Stack

- **Framework:** NestJS v11
- **Runtime:** Node.js 22
- **Database:** MySQL 8.0
- **ORM:** Drizzle ORM
- **Communication:** gRPC
- **Language:** TypeScript

## gRPC Endpoints

### StoreCategoryService

| Method | Request | Response | Description |
|--------|---------|----------|-------------|
| `GetStoreCategoryById` | `Id { id }` | `StoreCategoryWithTranslation` | Fetch category with all translations |
| `GetStoreCategoriesByLanguage` | `Language { language }` | `StoreCategoryList` | Get all categories by language |
| `CreateStoreCategory` | `CreateStoreCategoryRequest` | `Id` | Create a new category |
| `UpdateStoreCategory` | `UpdateStoreCategoryRequest` | `Id` | Update category (slug/availability) |
| `DeleteStoreCategory` | `Id { id }` | `StatusResponse` | Delete category with cascading |
| `ChangeStoreCategoryPosition` | `ChangeStoreCategoryPositionRequest` | `StoreCategory` | Reorder categories |
| `UpsertStoreCategoryTranslation` | `StoreCategoryTranslationRequest` | `Id` | Create or update translation |
| `DeleteStoreCategoryTranslation` | `Id { id }` | `StatusResponse` | Delete a translation |

### StoreItemService

| Method | Request | Response | Description |
|--------|---------|----------|-------------|
| `GetStoreItemsByCategoryIdWithOption` | `GetStoreItemsByCategoryIdWithOptionRequest` | `StoreItemListWithOption` | Get items by category with translated variants and attributes |
| `GetStoreItemById` | `GetStoreItemByIdRequest` | `StoreItemWithOption` | Get single item with translated variants and attributes |

### HealthCheckService

| Method | Request | Response | Description |
|--------|---------|----------|-------------|
| `CheckAppHealth` | `Empty` | `HealthCheckResponse` | Service liveness check |
| `CheckAppConnections` | `Empty` | `ReadinessResponse` | Dependency readiness check |

## Database Schema

```
category ──┬── category_translation (1:N)
            ├── attribute ──── attribute_translation (1:N)
            └── item ──┬── item_translation (1:N)
                       ├── image (1:N)
                       ├── item_price (1:N, optional FK to item_attribute)
                       └── item_attribute ──┬── item_attribute_translation (1:N)
                                            └── item_price (1:N, via FK)
```

`item_attribute` is a junction table linking an **item** to an **attribute** definition. Each item_attribute can have:
- **translations** — the attribute value for this item (e.g., "250g", "Washed")
- **prices** — variant prices (e.g., regular: 249 UAH). If no prices are linked, the attribute is treated as informational (e.g., score: 84)

All tables share base columns: `id` (UUID), `createdAt`, `updatedAt`.

### Table Fill Order

When populating the database, tables must be filled respecting foreign key dependencies:

```
Level 1 (independent)
  └── category

Level 2 (depends on category)
  ├── category_translation
  ├── attribute
  └── item

Level 3 (depends on level 2)
  ├── attribute_translation
  ├── item_translation
  ├── image
  └── item_attribute  (requires both item + attribute)

Level 4 (depends on level 3)
  ├── item_attribute_translation
  └── item_price  (requires item, optionally item_attribute)
```

### Admin Flow Example

Typical sequence for adding a new product:

1. **Category** already exists (via StoreCategoryService)
2. **Attributes** created once per category (e.g., "weight", "processing-type", "score")
3. **Attribute translations** added per language (e.g., "weight" -> "Вага")
4. **Create item** with slug, brand, categoryId
5. **Add item translations** per language (title, description)
6. **Link item_attribute** — connect item to attribute (e.g., item -> weight)
7. **Add item_attribute_translation** — set value per language (e.g., "250g" / "250г")
8. **Add item_price** — set prices linked to item_attribute (e.g., regular: 249 UAH)
9. Repeat steps 6-8 for each variant (250g, 1kg, etc.)
10. For info-only attributes (score, country), do steps 6-7 only (skip prices)
11. **Upload images** with url, alt text, sort order

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Deployment Environment
NODE_ENV=development

# gRPC Connection
TRANSPORT_URL=0.0.0.0:5004
HTTP_PORT=9104

# Database
DATABASE_URL=mysql://user:password@localhost:3306/store_db
```

## Project Setup

```bash
# Install dependencies
npm install

# Generate gRPC types from proto files
npm run proto:generate
```

## Running the Service

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## Docker Deployment

```bash
# Start MySQL database
docker-compose up -d

# Run the service
npm run start:dev
```

The service will be available at:
- **gRPC:** `0.0.0.0:5004`
- **HTTP:** `0.0.0.0:9104`
- **MySQL:** `localhost:3306`

## Project Structure

```
src/
├── app.module.ts                   # Root module
├── main.ts                         # Application entry point
├── health-check/                   # Health check module
│   ├── health-check.controller.ts
│   ├── health-check.service.ts
│   └── health-check.module.ts
├── store-category/                 # Category management
│   ├── store-category.controller.ts
│   ├── store-category.service.ts
│   ├── store.category.repository.ts
│   └── store-category.module.ts
├── store-item/                     # Item management (read + mapper)
│   ├── store-item.controller.ts
│   ├── store-item.service.ts
│   ├── store-item.repository.ts
│   ├── store-item.mapper.ts
│   └── store-item.module.ts
├── database/                       # Database layer
│   ├── database.module.ts
│   ├── drizzle.config.ts
│   ├── language.enum.ts
│   └── schema/                     # Drizzle ORM schemas
│       ├── category.schema.ts
│       ├── category-translation.schema.ts
│       ├── item.schema.ts
│       ├── item-translation.schema.ts
│       ├── item-price.schema.ts
│       ├── image.schema.ts
│       ├── attribute.schema.ts
│       ├── attribute-translation.schema.ts
│       ├── item-attribute.schema.ts
│       └── item-attribute-translation.schema.ts
├── utils/                          # Utilities
│   ├── env.dto.ts
│   ├── errors/
│   ├── filters/
│   └── validators/
└── generated-types/                # gRPC proto-generated types
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Proto Files

The service uses protocol buffers for gRPC communication:
- `proto/store-category.proto` - StoreCategoryService interface
- `proto/store-item.proto` - StoreItemService interface
- `proto/health-check.proto` - HealthCheckService interface

## Network

This service connects to the `coffeedoor-network` Docker network for inter-service communication with other microservices in the ecosystem.

## License

This project is proprietary software.
