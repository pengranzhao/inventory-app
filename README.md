# Project Name
Inventory App

## Version
- npm 10.2.4
- Node v21.6.2

## Overview
This prototype of the Inventory App has been developed to meet specific requirements. Although it represents a foundational step towards a commercial application, it is currently in an early stage of development.

### Implementation Details
- Database Compatibility: The system is designed to be compatible with PostgreSQL version 13.4.
- Modular Design: The project is structured into two primary modules: AppModule and DbModule. This structure promotes principles such as Separation of Concerns and reusability.
- Database Schema: The database includes two primary tables: inventories and orders. A foreign key relationship is established where inventories::product_id references the orders table. Additionally, inventories::productId is indexed as a unique key to facilitate efficient searches.
- Naming Conventions: Adhering to SQL database conventions, column names utilize snake_case as opposed to camelCase.

### To run and test the app
1. Start a local database with `docker-compose up`
2. Start the app with `npm run start`
3. Import test data. While specific scripts are not provided due to time constraint, tools like DbEaver can be used for data importation. 
4. Test via postman. Below are examples of queries for listing and updating inventory data.

#### listInventory
```
query ListInventory {
    listInventory(
        limit: 5
        page: 1
        sort: { field: QUANTITY, order: DESC }
        filter: { inStock: true }
    ) {
        category
        name
        id
        orders {
            amount
            campaign
            channel
            channelGroup
            currency
            dateTime
            orderId
            productId
            quantity
            shippingCost
        }
        quantity
        subCategory
    }
}
```

#### updateInventory

```
mutation a($inputs: [UpdateInventoryInput!]!) {
    updateInventory(updateInventoryInputs: $inputs) {
        id
        productId
        name
        quantity
        category
        subCategory
    }
}
{
    "inputs": [
        {
            "productId": "prod1548#prod104001000080",
            "quantity": 1002,
            "name": "Updated Product Name 1"
        },
        {
            "productId": "prod1566#prod106041004115",
            "quantity": 1502,
            "name": "Updated Product Name 2"
        }
    ]
}
```
## Future Enhancements
Several enhancements have been identified but not yet implemented.
1. #### Sorting by order quantity
      List all inventories sorting by total quantity of orders. There are a number of options here, such as subquery or sorting in application
      Here is an example of subquery.
      ```
      SELECT inventories.* , (SELECT COUNT("orders"."id") AS "orderCount" FROM "orders" WHERE "orders"."product_id" = "inventories"."product_id") AS "orderCount" 
        FROM "inventories" "inventories" 
        ORDER BY "orderCount" desc
      ```
2. #### Exception and logging
      Exception handling. Good exception handling and detailed logging mechanisms need to be added to ensure robustness and ease of debugging.

3. #### test cases
      Both unit and integratio tests are not included due to time limit 
4. #### local environment
      In a commercial project, there should be a dockerfile and a proper docker-compose file for test. So that the integrtion test can be executed against a local environment with real database. Here is an exmaple of docker-compose.yml
```
version: '3'
services:
  inventory-app:
    container_name: inventory-app
    build:
      context: .
    command: npm run test:cov
    ports:
      - 3000:3000
    depends_on:
      - postgresql
    links:
      - postgresql
    environment:
      - DB_HOST=http://postgresql:5432
  postgres:
    image: postgres:13.4-alpine
    container_name: postgres-inv
    environment:
      - POSTGRES_PASSWORD=password
    ports:
      - 5432:5432
    restart: always
```
    
 
   