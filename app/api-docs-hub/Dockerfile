FROM node:22-alpine
WORKDIR /app
COPY api-docs-hub/package.json api-docs-hub/package-lock.json* ./
COPY shared/ ../shared/
RUN npm install
COPY api-docs-hub/ .
EXPOSE 3000
CMD [ "node", "server.js" ]
