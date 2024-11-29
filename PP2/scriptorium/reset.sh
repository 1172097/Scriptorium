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

