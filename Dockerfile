# STAGE 1: BUILD
FROM node:20.11.0-slim AS build

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN chmod +x docker-entrypoint.sh

# STAGE 2: RUN
# FROM nginx:alpine
FROM cgr.dev/chainguard/nginx:latest-dev

USER root

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/news-app/browser /usr/share/nginx/html
COPY --from=build /usr/src/app/docker-entrypoint.sh /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]

# The Chainguard nginx image already runs nginx by default — no need to specify CMD.
CMD ["nginx", "-g", "daemon off;"]
