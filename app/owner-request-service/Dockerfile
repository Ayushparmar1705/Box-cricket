FROM node:22-alpine
WORKDIR /app
COPY owner-request-service/package.json owner-request-service/package-lock.json* ./
COPY shared/ ../shared/
RUN npm install
COPY owner-request-service/ .
EXPOSE 3006
CMD [ "node", "server.js" ]
