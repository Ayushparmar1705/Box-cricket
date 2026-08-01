FROM node:22-alpine
WORKDIR /app
COPY owner-document-service/package.json owner-document-service/package-lock.json* ./
COPY shared/ ../shared/
RUN npm install
COPY owner-document-service/ .
EXPOSE 3007
CMD [ "node", "server.js" ]
