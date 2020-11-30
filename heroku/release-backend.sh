#!/bin/sh

export AMAZON_S3_ACCESS_KEY=AKIASMPQTUATZZVNUIH2
export AMAZON_S3_SECRET_KEY=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
export GOOGLE_API_KEY=AIzaSyDSDFlqV9UDWh6V0D6STb7JU0-niCSb91U

IMAGE_ID=$(docker inspect ${HEROKU_REGISTRY_IMAGE_BACKEND} --format={{.Id}})
PAYLOAD='{"updates": [{"type": "web", "docker_image": "'"$IMAGE_ID"'"}]}'

curl -n -X PATCH https://api.heroku.com/apps/$HEROKU_APP_NAME_BACKEND/formation \
  -d "${PAYLOAD}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
  -H "Authorization: Bearer ${HEROKU_AUTH_TOKEN}"