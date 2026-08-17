FROM node:22-alpine
WORKDIR /app
COPY venue-service/package.json venue-service/package-lock.json* ./
COPY shared/ ../shared/
RUN npm install
COPY venue-service/ .
EXPOSE 3009
CMD [ "node", "server.js" ]
