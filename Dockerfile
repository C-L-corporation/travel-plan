# Use an official Node runtime as a parent image
FROM node:18.17-alpine

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json, yarn.lock, tsconfig.json, .eslintrc and prettierrc to the work directory
COPY package.json yarn.lock tsconfig.json .eslintrc.js .prettierrc ./


# Copy workspace folders
COPY server ./server
COPY client ./client

# Install dependencies
RUN yarn install --frozen-lockfile --ignore-optional

# Build the client project
WORKDIR /usr/src/app/client
RUN yarn build

# Build the server project
WORKDIR /usr/src/app/server
RUN yarn build

CMD ["yarn", "start"]
