# Development
FROM node:20.10.0 AS development

WORKDIR /app/natours-data-center

COPY ./package.json /app/natours-data-center

RUN npm install

COPY . /app/natours-data-center

EXPOSE 5173



# Locally preview the production build. Do not use this as a production server as it's not designed for it.
FROM node:20.10.0 AS preview

ARG VITE_KEY_PUBLIC
ARG VITE_URL_GRAPHQL
ARG VITE_URL_SERVER

ENV VITE_KEY_PUBLIC=$VITE_KEY_PUBLIC
ENV VITE_URL_GRAPHQL=$VITE_URL_GRAPHQL
ENV VITE_URL_SERVER=$VITE_URL_SERVER

WORKDIR /app/natours-data-center

COPY ./package.json /app/natours-data-center

RUN npm install

COPY . /app/natours-data-center

RUN npm run build

EXPOSE 4173
