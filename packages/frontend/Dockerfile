FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY packages/frontend/package.json packages/frontend/

# Install dependencies
RUN npm install

# Copy source code
COPY packages/frontend ./packages/frontend

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "-w", "@collab/frontend"]
