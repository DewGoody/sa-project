# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build process
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]
