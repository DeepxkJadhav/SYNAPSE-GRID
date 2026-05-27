FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY packages/backend/package.json packages/backend/
COPY packages/shared/package.json packages/shared/

# Install dependencies
RUN npm install

# Copy source code
COPY packages/backend/src ./packages/backend/src
COPY packages/backend/tsconfig.json ./packages/backend/
COPY packages/shared ./packages/shared

# Expose port
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev", "-w", "@collab/backend"]
