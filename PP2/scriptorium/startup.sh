#!/bin/bash

# made by chatGPT
# Check for Node.js installation
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js."
    exit 1
fi

# Check for npm installation
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Install required packages
echo "Installing packages..."
npm install

# Drop the existing database and create a new one
echo "Starting a new empty database..."
npx prisma migrate reset --force

# Run migrations to set up the database schema
echo "Running migrations..."
npx prisma migrate deploy

# Run the createadmin.js file
echo "Creating admin user..."
node utils/createAdmin.js

echo "Setup complete. A new empty database has been created and an admin user has been set up."
