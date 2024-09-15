# Specify node version and choose image
# also name our image as development (can be anything)
FROM node:20.16.0 AS development

# Update the package list
RUN apt-get update

RUN apt-get install -yyq ca-certificates

RUN apt-get install -yyq libappindicator1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6

RUN apt-get install -yyq gconf-service lsb-release wget xdg-utils

RUN apt-get install -yyq fonts-liberation


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

EXPOSE 8080

# Run
CMD [ "node", "dist/main" ]
