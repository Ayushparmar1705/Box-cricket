FROM node:22-alpine
WORKDIR /app
COPY category-service/package.json category-service/package-lock.json* ./
COPY shared/ ../shared/
RUN npm install
COPY category-service/ .
EXPOSE 3002
CMD [ "node", "server.js" ]
