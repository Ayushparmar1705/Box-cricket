FROM node:22-alpine
WORKDIR /app
COPY owner-basic-detail-service/package.json owner-basic-detail-service/package-lock.json* ./
RUN npm install
COPY owner-basic-detail-service/ .
EXPOSE 3003
CMD [ "node", "server.js" ]
