FROM node:22-alpine
WORKDIR /app
COPY auth-service/package.json auth-service/package-lock.json* ./
COPY shared/ ../shared/
RUN npm install
COPY auth-service/ .
EXPOSE 3001
CMD [ "node", "server.js" ]