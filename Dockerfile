# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite app
RUN npm run build

# Expose the port the app will run on
EXPOSE 5173

# Ensure that the local node_modules/.bin is in the PATH
ENV PATH /app/node_modules/.bin:$PATH

# Start the Vite app
CMD ["npm", "run", "dev", "--", "--host"]
