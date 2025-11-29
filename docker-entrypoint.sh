#!/bin/sh

ENV_FILE=/usr/share/nginx/html/config.json

echo "{" > $ENV_FILE

# Loop through all environment variables starting with APP_
printenv | grep '^APP_' | while IFS='=' read -r key value; do
  echo "  \"${key}\": \"${value}\"," >> $ENV_FILE
done

# Remove the trailing comma (optional but cleaner)
sed -i '$ s/,$//' $ENV_FILE

echo "}" >> $ENV_FILE

exec "$@"
