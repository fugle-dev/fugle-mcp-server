FROM --platform=linux/amd64 node:22.12 AS builder

# Copy package files first
COPY package.json package-lock.json /app/
# Copy the SDK to the correct path
COPY masterlink-sdk-1.0.0.tgz /app/
COPY fubon-neo-2.2.6.tgz /app/
# Set working directory
WORKDIR /app
# Copy the rest of the files
COPY tsconfig.json /app/
COPY src /app/src/

# Install dependencies
RUN npm install

FROM --platform=linux/amd64 node:22 AS release

COPY masterlink-sdk-1.0.0.tgz /app/
COPY fubon-neo-2.2.6.tgz /app/
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/node_modules /app/node_modules

ENV NODE_ENV=production

WORKDIR /app

RUN npm ci --ignore-scripts --omit-dev

ENTRYPOINT ["node", "build/index.js"]