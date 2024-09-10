# Specify node version and choose image
# also name our image as development (can be anything)
FROM node:20.16.0-alpine AS development

RUN apk update && apk add --no-cache \
    ca-certificates \
    libappindicator \
    alsa-lib \
    atk \
    libc6-compat \
    cairo \
    cups-libs \
    dbus \
    expat \
    fontconfig \
    libgcc \
    gconf \
    gdk-pixbuf \
    glib \
    gtk+3.0 \
    nspr \
    nss \
    pango \
    libstdc++ \
    libx11 \
    libx11-xcb \
    libxcb \
    libxcomposite \
    libxcursor \
    libxdamage \
    libxext \
    libxfixes \
    libxi \
    libxrandr \
    libxrender \
    libxss \
    libxtst \
    lsb-release \
    wget \
    xdg-utils \
    ttf-liberation

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

# Run
CMD [ "node", "dist/main" ]
