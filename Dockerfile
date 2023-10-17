# Use the official Node.js 14 Alpine image as the base
FROM node:20-alpine

# Set the working directory inside the Docker image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project directory to the working directory
COPY . .
ENV NODE_ENV=production
# Build the Next.js project
RUN npm run build

# Expose the port that the Next.js application will run on
EXPOSE 3000

# Set the command to run when the Docker container starts
CMD ["npm", "run", "start"]
