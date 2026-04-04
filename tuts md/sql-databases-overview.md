# SQL Databases Overview

SQL (Structured Query Language) databases are relational databases that store data in tables, which are organized into rows and columns. They enforce a strict schema, ensuring data integrity and consistency. Common examples include PostgreSQL, MySQL, SQLite, and SQL Server.

## 1. Key Concepts

*   **Table:** A collection of related data organized into rows and columns.
*   **Row (Record/Tuple):** A single entry in a table, containing data for each column.
*   **Column (Field/Attribute):** Represents a specific piece of data, with a defined data type (e.g., `VARCHAR`, `INT`, `DATE`).
*   **Primary Key (PK):** A column (or set of columns) that uniquely identifies each row in a table. Must be unique and not null.
*   **Foreign Key (FK):** A column (or set of columns) that refers to the primary key in another table, establishing a relationship between tables.
*   **Schema:** The logical structure of the entire database, including tables, columns, relationships, indexes, etc.

## 2. Common SQL Databases

*   **PostgreSQL:** Powerful, open-source object-relational database system known for its reliability, feature robustness, and performance.
*   **MySQL:** The world's most popular open-source database, widely used for web applications.
*   **SQLite:** A self-contained, serverless, zero-configuration, transactional SQL database engine. Ideal for embedded devices and local development.
*   **Microsoft SQL Server:** Microsoft's proprietary relational database management system.

## 3. Installation (Example: PostgreSQL)

### macOS (using Homebrew)
```bash
brew update
brew install postgresql@14 # Or latest stable version
brew services start postgresql@14
```

### Linux (using `apt` for Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
Download the installer from the [official PostgreSQL website](https://www.postgresql.org/download/windows/).

### Basic PostgreSQL Commands
```bash
# Connect to the default 'postgres' database as the 'postgres' user
psql -U postgres

# Inside psql:
\l       -- List databases
\c <db_name> -- Connect to a database
\dt      -- List tables in current database
\du      -- List users (roles)
\q       -- Quit psql

# Create a new database
CREATE DATABASE mydatabase;

# Create a new user (role) with password
CREATE USER myuser WITH PASSWORD 'mypassword';

# Grant privileges to the user on the database
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
```

## 4. Basic SQL Commands (DML & DDL)

These commands are largely standard across different SQL databases, with minor syntax variations.

### Data Definition Language (DDL)

*   **CREATE TABLE:**
    ```sql
    CREATE TABLE Users (
        id SERIAL PRIMARY KEY, -- Auto-incrementing integer, primary key
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE Products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock_quantity INT DEFAULT 0
    );
    ```

*   **ALTER TABLE:**
    ```sql
    ALTER TABLE Users
    ADD COLUMN status VARCHAR(50) DEFAULT 'active';

    ALTER TABLE Products
    RENAME COLUMN name TO product_name;
    ```

*   **DROP TABLE:**
    ```sql
    DROP TABLE Products;
    ```

### Data Manipulation Language (DML)

*   **INSERT:**
    ```sql
    INSERT INTO Users (name, email, age)
    VALUES ('Alice Smith', 'alice.s@example.com', 28);

    INSERT INTO Users (name, email)
    VALUES ('Bob Johnson', 'bob.j@example.com');
    ```

*   **SELECT:**
    ```sql
    SELECT * FROM Users; -- Select all columns from Users table
    
    SELECT name, email FROM Users WHERE age > 25;
    
    SELECT * FROM Users WHERE name LIKE 'A%' ORDER BY age DESC;
    
    SELECT COUNT(*) FROM Users;
    
    SELECT AVG(age) FROM Users;
    
    SELECT name, email FROM Users LIMIT 1 OFFSET 1; -- Get the second user
    ```

*   **UPDATE:**
    ```sql
    UPDATE Users
    SET age = 29
    WHERE email = 'alice.s@example.com';
    
    UPDATE Users
    SET status = 'inactive'
    WHERE age < 25;
    ```

*   **DELETE:**
    ```sql
    DELETE FROM Users
    WHERE email = 'bob.j@example.com';
    
    DELETE FROM Users
    WHERE age IS NULL;
    ```

## 5. Connecting with Node.js

Node.js has various libraries (drivers/clients) for connecting to SQL databases.

### PostgreSQL (using `pg`)

**Install:**
```bash
mkdir my-postgres-app
cd my-postgres-app
npm init -y
npm install pg
```

**File: `app.js`**
```javascript
// app.js
const { Client } = require('pg');

const client = new Client({
  user: 'myuser',
  host: 'localhost',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
});

async function connectAndQuery() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database!');

    // === Create Table ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE
      );
    `);
    console.log('Table 