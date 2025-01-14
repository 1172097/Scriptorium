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

# Install required packages
echo "Installing packages..."
npm install

# Build Docker images
echo "Building Docker images..."
cd "$(dirname "$0")/docker"

# languages=("python" "javascript" "java" "cpp" "golang" "ruby" "rust" "php" "csharp" "swift")

# for lang in "${languages[@]}"; do
#     echo "Building $lang image..."
#     docker build --memory 2g --no-cache --pull -t "code-executor-$lang:latest" "$lang/"
# done

cd ..

# Drop the existing database and create a new one
echo "Starting a new empty database..."
npx prisma migrate reset --force

# Run migrations to set up the database schema
echo "Running migrations..."
npx prisma migrate deploy

# Run the createadmin.js file
echo "Creating admin user..."
node utils/seed.js
node utils/createAdmin.js

echo "Setup complete. A new empty database has been created and an admin user has been set up."
echo "username: admin"
echo "password: password123"
echo "For test users:"
echo "username: user2"
echo "password: password2"


