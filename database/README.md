# Database Structure and Migrations for Student Employment Platform

This directory contains SQL scripts for managing the database of the Student Employment Platform. It includes migration scripts for initializing the database schema and seed scripts for populating the database with sample data.

## Directory Structure

- **migrations**: Contains SQL scripts for initializing and modifying the database schema.
  - `init.sql`: Script to create the initial database schema.
  
- **seeders**: Contains SQL scripts for populating the database with sample data.
  - `sample-data.sql`: Script to insert sample data into the database for testing purposes.

## Usage

To set up the database, run the migration scripts in the following order:

1. Execute `init.sql` to create the necessary tables and relationships.
2. Optionally, run `sample-data.sql` to populate the database with initial data for testing.

Ensure that your database connection settings are correctly configured in the backend `.env` file before running the migration scripts.