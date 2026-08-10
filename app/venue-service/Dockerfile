FROM node:22-alpine
WORKDIR /app
COPY city-service/package.json city-service/package-lock.json* ./
COPY shared/ ../shared/
RUN npm install
COPY city-service/ .
EXPOSE 3008
CMD [ "node", "server.js" ]
