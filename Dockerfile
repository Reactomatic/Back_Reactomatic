# Specify node version and choose image
# also name our image as development (can be anything)
FROM node:20.16.0-alpine AS development

# Specify our working directory, this is in our container/in our image
WORKDIR /app

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Here we install all the deps
RUN npm ci

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
RUN npm run build

################
## PRODUCTION ##
################
# Build another image named production
FROM node:20.16.0-alpine AS production

# Set Working Directory
WORKDIR /app

# Copy all from development stage
COPY --from=development /app/ .

EXPOSE 8080

# Run app
CMD [ "node", "dist/main" ]