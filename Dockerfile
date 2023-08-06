# Use official Node.js Docker image
FROM node:18.17

# Set working directory in Docker image
WORKDIR /usr/src/app

# Set Node environment variable to production
ENV NODE_ENV=production

# Copy package.json, yarn.lock and package.json files in client and server directories
COPY package*.json yarn.lock ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install Vite globally
RUN yarn global add vite
# Install dependencies
RUN yarn install --production

# Copy the application code
COPY . .

# Build the client and server apps
RUN yarn build

# Specify the command to run
CMD [ "yarn", "start" ]
