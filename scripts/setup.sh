#!/bin/bash

set -e

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Config
CONTAINER_NAME=vehicle_pg
DB_NAME=vehicle_matching
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
PORT=5432

echo "🧹 Removing existing PostgreSQL container (if any)..."
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  docker rm -f $CONTAINER_NAME
  echo "✅ Removed old container."
fi

echo "🔧 Starting PostgreSQL container..."

# Run container if not already running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "✅ Container '$CONTAINER_NAME' is already running."
else
  if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🔁 Restarting existing container..."
    docker start $CONTAINER_NAME
  else
    echo "🚀 Creating new PostgreSQL container..."
    docker run --name $CONTAINER_NAME -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -p $PORT:5432 -d postgres
    echo "⏳ Waiting for Postgres to be ready..."
    sleep 5
  fi
fi

echo "📥 Seeding data from data.sql into $DB_NAME..."

# Create DB if not exists
docker exec -u $POSTGRES_USER $CONTAINER_NAME psql -U $POSTGRES_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
  docker exec -u $POSTGRES_USER $CONTAINER_NAME createdb $DB_NAME

# Feed SQL file
docker exec -i $CONTAINER_NAME psql -U $POSTGRES_USER -d $DB_NAME < ./scripts/data.sql

echo "✅ PostgreSQL setup complete."
