# Build Stage for React
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage for Node.js
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/backend ./backend
COPY --from=build /app/agents/run-agent.js ./agents/run-agent.js

# ENV for production
ENV NODE_ENV=production
EXPOSE 8080
CMD ["npm", "run", "server"]
