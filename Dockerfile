# Utilise une image Node.js 20.16.0 officielle comme image de base
FROM node:20.16.0-alpine

# Définit le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copie les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installe les dépendances de l'application
RUN npm install --production

# Copie le reste des fichiers de l'application dans le conteneur
COPY . .

# Compile l'application TypeScript en JavaScript
RUN npm run build

# Définit la commande par défaut pour démarrer l'application
CMD ["npm", "run", "start:prod"]

# Expose le port que l'application va utiliser
EXPOSE 3000
