#!/bin/bash

# Script to create config.json for CI/CD environments
# This ensures the config file exists even though it's in .gitignore

CONFIG_FILE="src/assets/config.json"
EXAMPLE_FILE="src/assets/config.json.example"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Creating $CONFIG_FILE from $EXAMPLE_FILE..."

  if [ -f "$EXAMPLE_FILE" ]; then
    cp "$EXAMPLE_FILE" "$CONFIG_FILE"
    echo "✓ Config file created successfully"
  else
    echo "✗ Error: $EXAMPLE_FILE not found"
    exit 1
  fi
else
  echo "✓ Config file already exists"
fi
