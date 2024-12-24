# Use the official Node.js image as a base image
FROM node:18-alpine

# Install required dependencies, including OpenSSL
RUN apk add --no-cache openssl

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy wait-for-it.sh into the container
COPY wait-for-it.sh /app/
RUN chmod +x /app/wait-for-it.sh


# Run the build process
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Command to start the Next.js app
CMD ["sh", "-c", "./wait-for-it.sh postgres-db:5432 -- npx prisma migrate dev && npm start"]
