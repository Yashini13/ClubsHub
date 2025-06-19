# Use Node image
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the server
CMD ["node", "index.js"]  # Or app.js depending on your main file
